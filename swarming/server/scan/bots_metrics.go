// Copyright 2024 The LUCI Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package scan

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"go.chromium.org/luci/common/data/stringset"
	"go.chromium.org/luci/common/logging"
	"go.chromium.org/luci/common/tsmon"
	"go.chromium.org/luci/common/tsmon/monitor"
	"go.chromium.org/luci/common/tsmon/target"

	"go.chromium.org/luci/swarming/server/metrics"
	"go.chromium.org/luci/swarming/server/model"
)

// BotsMetricsReporter is BotVisitor that reports stats about bots to the
// monitoring.
type BotsMetricsReporter struct {
	// ServiceName is a service name to put into metrics' target.
	ServiceName string
	// JobName is a job name to put into metrics' target.
	JobName string
	// Monitor to use to flush metrics.
	Monitor monitor.Monitor

	state  *tsmon.State
	shards []*shardState
}

var _ BotVisitor = (*BotsMetricsReporter)(nil)

// Prepare prepares the visitor to use `shards` parallel queries.
//
// Part of BotVisitor interface.
func (r *BotsMetricsReporter) Prepare(ctx context.Context, shards int) {
	r.state = newTSMonState(r.ServiceName, r.JobName, r.Monitor)
	r.shards = make([]*shardState, shards)
	for i := range r.shards {
		r.shards[i] = newShardState()
	}
}

// Visit is called for every bot.
//
// Part of BotVisitor interface.
func (r *BotsMetricsReporter) Visit(ctx context.Context, shard int, bot *model.BotInfo) {
	r.shards[shard].collect(ctx, bot)
	setExecutorMetrics(tsmon.WithState(ctx, r.state), bot, r.ServiceName)
}

// Finalize is called once the scan is done.
//
// Part of BotVisitor interface.
func (r *BotsMetricsReporter) Finalize(ctx context.Context, scanErr error) error {
	// Report final counts only if scan completed successfully to avoid bogus
	// values (better no values at all). Flush whatever was reported by
	// setExecutorMetrics(...) even if the scan failed midway: these values are
	// valid (they are per-bot, doesn't matter if not all bots were visited).
	if scanErr == nil {
		total := newShardState()
		for _, shard := range r.shards {
			total.mergeFrom(shard)
		}
		mctx := tsmon.WithState(ctx, r.state)
		for key, val := range total.counts {
			metrics.BotsPerState.Set(mctx, val, key.pool, key.state)
		}
	}
	return flushTSMonState(ctx, r.state)
}

////////////////////////////////////////////////////////////////////////////////

// ignoredDimensions is dimensions to exclude from the BotsDimensionsPool metric
// value.
//
// Ignoring these values significantly reduces total cordiality of the set of
// metric values (speeding up precalculations based on it) or discards
// information not actually relevant for monitoring.
//
// Keep in sync with luci/appengine/swarming/ts_mon_metrics.py.
var ignoredDimensions = stringset.NewFromSlice(
	// Side effect of the health of each Android devices connected to the bot.
	"android_devices",
	// Unbounded set of values.
	"caches",
	// Unique for each bot, already part of the metric target.
	"id",
	// Server-assigned, not relevant to the bot at all.
	"server_version",
	// Android specific.
	"temp_band",
)

type shardState struct {
	counts map[counterKey]int64
	total  int64
}

type counterKey struct {
	pool  string // e.g. "luci.infra.ci"
	state string // e.g. "SWARMING"
}

func newShardState() *shardState {
	return &shardState{
		counts: map[counterKey]int64{},
	}
}

func (s *shardState) collect(ctx context.Context, bot *model.BotInfo) {
	migrationState := "UNKNOWN"

	if bot.Quarantined {
		migrationState = "QUARANTINED"
	} else if bot.IsInMaintenance() {
		migrationState = "MAINTENANCE"
	} else {
		var botState struct {
			Handshaking   bool   `json:"handshaking,omitempty"`
			RBEInstance   string `json:"rbe_instance,omitempty"`
			RBEHybridMode bool   `json:"rbe_hybrid_mode,omitempty"`
		}
		if err := json.Unmarshal(bot.State, &botState); err == nil {
			switch {
			case botState.Handshaking:
				// This is not a fully connected bot.
				return
			case botState.RBEInstance == "":
				migrationState = "SWARMING"
			case botState.RBEHybridMode:
				migrationState = "HYBRID"
			case !botState.RBEHybridMode:
				migrationState = "RBE"
			}
		} else {
			logging.Warningf(ctx, "Bot %s: bad state:\n:%s", bot.BotID(), bot.State)
		}
	}

	if bot.IsDead() {
		migrationState = "DEAD_" + migrationState
	}

	pools := bot.DimenionsByKey("pool")
	if len(pools) == 0 {
		pools = []string{"unknown"}
	}
	for _, pool := range pools {
		s.counts[counterKey{pool, migrationState}] += 1
	}
	s.total += 1
}

func (s *shardState) mergeFrom(another *shardState) {
	for key, count := range another.counts {
		s.counts[key] += count
	}
	s.total += another.total
}

// setExecutorMetrics sets metrics reported to the per-bot target.
func setExecutorMetrics(ctx context.Context, bot *model.BotInfo, serviceName string) {
	// TODO(vadimsh): Stop parsing bot.State multiple times.
	rbeState := "none"
	var botState struct {
		RBEInstance string `json:"rbe_instance,omitempty"`
	}
	if err := json.Unmarshal(bot.State, &botState); err == nil {
		if botState.RBEInstance != "" {
			rbeState = botState.RBEInstance
		}
	} else {
		logging.Warningf(ctx, "Bot %s: bad state:\n:%s", bot.BotID(), bot.State)
	}

	// Each bot has its own target.
	ctx = target.Set(ctx, &target.Task{
		DataCenter:  "appengine",
		ServiceName: serviceName,
		HostName:    fmt.Sprintf("autogen:%s", bot.BotID()),
	})
	metrics.BotsStatus.Set(ctx, bot.GetStatus())
	metrics.BotsDimensionsPool.Set(ctx, poolFromDimensions(bot.Dimensions))
	metrics.BotsRBEInstance.Set(ctx, rbeState)
}

// poolFromDimensions serializes the bot's dimensions and trims out redundant
// prefixes, i.e. ["cpu:x86-64", "cpu:x86-64-Broadwell_GCE"] returns
// "cpu:x86-64-Broadwell_GCE".
func poolFromDimensions(dims []string) string {
	// Assuming dimensions are sorted.
	var pairs []string

	for current := 0; current < len(dims); current++ {
		key := strings.SplitN(dims[current], ":", 2)[0]
		if ignoredDimensions.Has(key) {
			continue
		}
		next := current + 1
		// Set `current` to the longest (and last) prefix of the chain.
		// i.e. if chain is ["os:Ubuntu", "os:Ubuntu-22", "os:Ubuntu-22.04"]
		// dimensions[current] is "os:Ubuntu-22.04"
		for next < len(dims) && strings.HasPrefix(dims[next], dims[current]) {
			current++
			next++
		}
		pairs = append(pairs, dims[current])
	}
	return strings.Join(pairs, "|")
}