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

package main

import (
	"flag"
	"strings"

	"go.chromium.org/luci/common/data/stringset"
	"go.chromium.org/luci/server"
	"go.chromium.org/luci/server/cron"
	"go.chromium.org/luci/server/gaeemulation"
	"go.chromium.org/luci/server/module"
	"go.chromium.org/luci/server/tq"

	"go.chromium.org/luci/swarming/server/bq"
)

func main() {
	modules := []module.Module{
		cron.NewModuleFromFlags(),
		gaeemulation.NewModuleFromFlags(),
		tq.NewModuleFromFlags(),
	}

	bqExportDataset := flag.String(
		"bq-export-dataset",
		"none",
		"'none' will do no exports. Otherwise will specify which bq dataset to export to.",
	)

	bqExportOneTable := flag.String(
		"bq-export-only-one-table",
		"",
		"If set, the exporter cron will dispatch exports only for this one table. Useful when running locally.",
	)

	bqExportToPubSub := flag.String(
		"bq-export-to-pubsub",
		"none",
		"A comma separated list of tables that should also be exported to PubSub or literal 'none'.",
	)

	bqExportPubSubTopicPrefix := flag.String(
		"bq-export-to-pubsub-topic-prefix",
		"none",
		"A prefix to append to PubSub topic names or literal 'none' to not use a prefix.",
	)

	server.Main(nil, modules, func(srv *server.Server) error {
		var exportToPubSubSet stringset.Set
		if *bqExportToPubSub != "" && *bqExportToPubSub != "none" {
			exportToPubSubSet = stringset.New(0)
			for _, table := range strings.Split(*bqExportToPubSub, ",") {
				exportToPubSubSet.Add(strings.TrimSpace(table))
			}
		}
		if *bqExportPubSubTopicPrefix == "none" {
			*bqExportPubSubTopicPrefix = ""
		}
		return bq.Register(srv,
			&tq.Default,
			&cron.Default,
			*bqExportDataset,
			*bqExportOneTable,
			exportToPubSubSet,
			*bqExportPubSubTopicPrefix,
		)
	})
}
