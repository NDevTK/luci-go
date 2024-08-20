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

package groups

import (
	"context"
	"testing"
	"time"

	"go.chromium.org/luci/common/testing/ftt"
	"go.chromium.org/luci/common/testing/truth/assert"
	"go.chromium.org/luci/common/testing/truth/should"
	"go.chromium.org/luci/gae/impl/memory"
	"go.chromium.org/luci/gae/service/datastore"

	"go.chromium.org/luci/auth_service/impl/model"
)

var (
	testCreatedTS  = time.Date(2020, time.August, 16, 15, 20, 0, 0, time.UTC)
	testModifiedTS = time.Date(2021, time.August, 16, 12, 20, 0, 0, time.UTC)
)

func testAuthVersionedEntityMixin() model.AuthVersionedEntityMixin {
	return model.AuthVersionedEntityMixin{
		ModifiedTS:    testModifiedTS,
		ModifiedBy:    "user:test-modifier@example.com",
		AuthDBRev:     337,
		AuthDBPrevRev: 336,
	}
}

func testGroup(ctx context.Context, name string, members []string) *model.AuthGroup {
	return &model.AuthGroup{
		Kind:                     "AuthGroup",
		AuthVersionedEntityMixin: testAuthVersionedEntityMixin(),
		ID:                       name,
		Parent:                   model.RootKey(ctx),
		Owners:                   model.AdminGroup,
		Members:                  members,
		CreatedTS:                testCreatedTS,
		CreatedBy:                "user:test-creator@example.com",
	}
}

// putRev is a test helper function to put an AuthDB replication state
// into Datastore for the given revision.
func putRev(ctx context.Context, authDBRev int64) error {
	return datastore.Put(ctx, &model.AuthReplicationState{
		Kind:      "AuthReplicationState",
		AuthDBRev: authDBRev,
		Parent:    model.RootKey(ctx),
	})
}

func TestCachingGroupsProvider(t *testing.T) {
	t.Parallel()

	ftt.Run("CachingGroupsProvider works", t, func(t *ftt.Test) {
		ctx := memory.Use(context.Background())
		provider := &CachingGroupsProvider{}

		// Set up initial revision with 2 groups.
		assert.Loosely(t, datastore.Put(ctx,
			testGroup(ctx, "test-group-b", []string{"user:bob@example.com"}),
			testGroup(ctx, "test-group-a", []string{"user:alice@example.com"}),
		), should.BeNil)
		assert.Loosely(t, putRev(ctx, 1000), should.BeNil)

		// Check all groups were fetched.
		groups, err := provider.GetAllAuthGroups(ctx)
		assert.Loosely(t, err, should.BeNil)
		assert.Loosely(t, groups, should.Resemble([]*model.AuthGroup{
			testGroup(ctx, "test-group-a", []string{"user:alice@example.com"}),
			testGroup(ctx, "test-group-b", []string{"user:bob@example.com"}),
		}))

		// Add a member to test-group-b, WITHOUT updating the revision.
		assert.Loosely(t, datastore.Put(ctx,
			testGroup(ctx, "test-group-a", []string{
				"user:alice@example.com", "user:eve@example.com"},
			)), should.BeNil)

		// Check the cached group results were returned.
		groups, err = provider.GetAllAuthGroups(ctx)
		assert.Loosely(t, err, should.BeNil)
		assert.Loosely(t, groups, should.Resemble([]*model.AuthGroup{
			testGroup(ctx, "test-group-a", []string{"user:alice@example.com"}),
			testGroup(ctx, "test-group-b", []string{"user:bob@example.com"}),
		}))

		// Increase the AuthD replication state revision (making the cached
		// results outdated).
		assert.Loosely(t, putRev(ctx, 1001), should.BeNil)

		// Check the groups result now has the member update.
		groups, err = provider.GetAllAuthGroups(ctx)
		assert.Loosely(t, err, should.BeNil)
		assert.Loosely(t, groups, should.Resemble([]*model.AuthGroup{
			testGroup(ctx, "test-group-a", []string{"user:alice@example.com", "user:eve@example.com"}),
			testGroup(ctx, "test-group-b", []string{"user:bob@example.com"}),
		}))
	})
}
