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

package rpcs

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	"go.chromium.org/luci/common/clock"
	"go.chromium.org/luci/common/logging"
	"go.chromium.org/luci/gae/service/datastore"

	apipb "go.chromium.org/luci/swarming/proto/api_v2"
	"go.chromium.org/luci/swarming/server/acls"
)

// CountTasks returns the latest task count for the given request.
func (srv *TasksServer) CountTasks(ctx context.Context, req *apipb.TasksCountRequest) (*apipb.TasksCount, error) {
	// Require a limited time range. Counting all tasks ever is very expensive.
	if req.Start == nil {
		return nil, status.Errorf(codes.InvalidArgument, "start timestamp is required")
	}
	if req.End == nil {
		req.End = timestamppb.New(clock.Now(ctx))
	}

	// Validate the rest of arguments and get TaskResultSummary datastore queries.
	queries, err := StartTaskListingRequest(ctx, &TaskListingRequest{
		Perm:      acls.PermPoolsListTasks,
		Start:     req.Start,
		End:       req.End,
		State:     req.State,
		Tags:      req.Tags,
		SplitMode: srv.TaskQuerySplitMode,
	})
	switch {
	case err != nil:
		return nil, err
	case len(queries) == 0:
		panic("impossible, not using cursors")
	}

	// If we only have one query to run, we can make use of an aggregation query
	// and utilize the datastore server-side counting (this requires the query
	// to be eventually consistent). Otherwise, we need to count locally using
	// datastore.CountMulti().
	useAggregation := len(queries) == 1
	var count int64
	if useAggregation {
		count, err = datastore.Count(ctx, queries[0].EventualConsistency(true))
	} else {
		// FirestoreMode ensures all queries are strongly consistent. This allows
		// them to be used in a transaction, which ensures a more accurate count.
		for i, q := range queries {
			queries[i] = q.FirestoreMode(true).EventualConsistency(false)
		}
		err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
			count, err = datastore.CountMulti(ctx, queries)
			return err
		}, &datastore.TransactionOptions{ReadOnly: true})
	}

	if err != nil {
		logging.Errorf(ctx, "Error in TaskResultSummary query: %s", err)
		return nil, status.Errorf(codes.Internal, "datastore error counting tasks")
	}

	return &apipb.TasksCount{
		Count: int32(count),
		Now:   timestamppb.New(clock.Now(ctx)),
	}, nil
}
