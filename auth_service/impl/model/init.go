// Copyright 2022 The LUCI Authors.
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

package model

import (
	"context"

	"google.golang.org/protobuf/reflect/protoreflect"

	"go.chromium.org/luci/common/logging"
	"go.chromium.org/luci/server/tq"

	"go.chromium.org/luci/auth_service/api/taskspb"
)

func init() {
	// Parse flags fron environment variables.
	dryRunChangelog := ParseDryRunEnvVar(DryRunTQChangelogEnvVar)
	dryRunReplication := ParseDryRunEnvVar(DryRunTQReplicationEnvVar)
	// The permissions maintained by the Python version should be used
	// instead if the update-realms cron is in dry run mode.
	useV1Perms := ParseDryRunEnvVar(DryRunCronRealmsEnvVar)

	tq.RegisterTaskClass(tq.TaskClass{
		ID:        "process-change-task",
		Prototype: (*taskspb.ProcessChangeTask)(nil),
		Kind:      tq.Transactional,
		Queue:     "changelog-generation",
		Handler: func(ctx context.Context, payload protoreflect.ProtoMessage) error {
			task := payload.(*taskspb.ProcessChangeTask)
			logging.Infof(ctx, "got revision %d", task.AuthDbRev)
			return handleProcessChangeTask(ctx, payload.(*taskspb.ProcessChangeTask), dryRunChangelog)
		},
	})
	tq.RegisterTaskClass(tq.TaskClass{
		ID:        "replication-task",
		Prototype: (*taskspb.ReplicationTask)(nil),
		Kind:      tq.Transactional,
		Queue:     "auth-db-replication",
		Handler: func(ctx context.Context, payload protoreflect.ProtoMessage) error {
			task := payload.(*taskspb.ReplicationTask)
			logging.Infof(ctx, "got revision %d", task.AuthDbRev)
			return handleReplicationTask(ctx, payload.(*taskspb.ReplicationTask), dryRunReplication, useV1Perms)
		},
	})
}
