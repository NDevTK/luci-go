// Copyright 2024 The LUCI Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package model

import (
	"context"
	"fmt"
	"testing"

	"google.golang.org/protobuf/encoding/prototext"
	"google.golang.org/protobuf/proto"

	"go.chromium.org/luci/common/clock"
	"go.chromium.org/luci/common/clock/testclock"
	realmsconf "go.chromium.org/luci/common/proto/realms"
	"go.chromium.org/luci/gae/filter/txndefer"
	gaemem "go.chromium.org/luci/gae/impl/memory"
	"go.chromium.org/luci/gae/service/datastore"
	"go.chromium.org/luci/server/auth"
	"go.chromium.org/luci/server/auth/authtest"
	"go.chromium.org/luci/server/auth/service/protocol"
	"go.chromium.org/luci/server/tq"

	"go.chromium.org/luci/auth_service/impl/info"
	"go.chromium.org/luci/auth_service/testsupport"

	. "github.com/smartystreets/goconvey/convey"
)

func TestGetStoredRealmsCfgRevs(t *testing.T) {
	t.Parallel()

	Convey("getting stored project realms config rev works", t, func() {
		ctx := gaemem.Use(context.Background())

		Convey("successful if none exist", func() {
			configRevs, err := getStoredRealmsCfgRevs(ctx)
			So(err, ShouldBeNil)
			So(configRevs, ShouldBeEmpty)
		})

		Convey("returns the stored configs from metadata", func() {
			// Set up metadata for a project's realms config in datastore.
			So(datastore.Put(ctx, &AuthProjectRealmsMeta{
				Kind:         "AuthProjectRealmsMeta",
				ID:           "meta",
				Parent:       projectRealmsKey(ctx, "test"),
				PermsRev:     "123",
				ConfigRev:    "1234",
				ConfigDigest: "test-digest",
				ModifiedTS:   testModifiedTS,
			}), ShouldBeNil)

			configRevs, err := getStoredRealmsCfgRevs(ctx)
			So(err, ShouldBeNil)
			So(configRevs, ShouldResemble, []*RealmsCfgRev{
				{
					ProjectID:    "test",
					ConfigRev:    "1234",
					PermsRev:     "123",
					ConfigDigest: "test-digest",
				},
			})
		})
	})
}

func TestUpdateRealms(t *testing.T) {
	t.Parallel()

	simpleProjectRealm := func(ctx context.Context, projectName string, expectedRealmsBody []byte, authDBRev int) *AuthProjectRealms {
		return &AuthProjectRealms{
			AuthVersionedEntityMixin: AuthVersionedEntityMixin{
				ModifiedTS:    testCreatedTS,
				ModifiedBy:    "user:test-app-id@example.com",
				AuthDBRev:     int64(authDBRev),
				AuthDBPrevRev: int64(authDBRev - 1),
			},
			Kind:      "AuthProjectRealms",
			ID:        fmt.Sprintf("test-project-%s", projectName),
			Parent:    RootKey(ctx),
			Realms:    expectedRealmsBody,
			ConfigRev: testsupport.TestRevision,
			PermsRev:  "permissions.cfg:123",
		}
	}

	simpleProjectRealmMeta := func(ctx context.Context, projectName string) *AuthProjectRealmsMeta {
		return &AuthProjectRealmsMeta{
			Kind:         "AuthProjectRealmsMeta",
			ID:           "meta",
			Parent:       datastore.NewKey(ctx, "AuthProjectRealms", fmt.Sprintf("test-project-%s", projectName), 0, RootKey(ctx)),
			ConfigRev:    testsupport.TestRevision,
			ConfigDigest: testsupport.TestContentHash,
			ModifiedTS:   testCreatedTS,
			PermsRev:     "permissions.cfg:123",
		}
	}

	Convey("testing updating realms", t, func() {
		ctx := auth.WithState(gaemem.Use(context.Background()), &authtest.FakeState{
			Identity: "user:someone@example.com",
		})
		ctx = testsupport.SetTestContextSigner(ctx, "test-app-id", "test-app-id@example.com")
		ctx = clock.Set(ctx, testclock.New(testCreatedTS))
		ctx = info.SetImageVersion(ctx, "test-version")
		ctx, taskScheduler := tq.TestingContext(txndefer.FilterRDS(ctx), nil)

		Convey("works", func() {
			Convey("simple config 1 entry", func() {
				configBody, _ := prototext.Marshal(&realmsconf.RealmsCfg{
					Realms: []*realmsconf.Realm{
						{
							Name: "test-realm",
						},
					},
				})

				revs := []*RealmsCfgRev{
					{
						ProjectID:    "test-project-a",
						ConfigRev:    testsupport.TestRevision,
						ConfigDigest: testsupport.TestContentHash,
						ConfigBody:   configBody,
					},
				}
				err := updateRealms(ctx, testsupport.PermissionsDB(false), revs, false, "latest config")
				So(err, ShouldBeNil)
				So(taskScheduler.Tasks(), ShouldHaveLength, 2)

				expectedRealmsBody, _ := proto.Marshal(&protocol.Realms{
					Realms: []*protocol.Realm{
						{
							Name: "test-project-a:@root",
						},
						{
							Name: "test-project-a:test-realm",
						},
					},
				})

				fetchedPRealms, err := GetAuthProjectRealms(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealms, ShouldResemble, simpleProjectRealm(ctx, "a", expectedRealmsBody, 1))

				fetchedPRealmMeta, err := GetAuthProjectRealmsMeta(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealmMeta, ShouldResemble, simpleProjectRealmMeta(ctx, "a"))
			})

			Convey("updating project entry with config changes", func() {
				cfgBody, _ := prototext.Marshal(&realmsconf.RealmsCfg{
					Realms: []*realmsconf.Realm{
						{
							Name: "test-realm",
						},
					},
				})

				revs := []*RealmsCfgRev{
					{
						ProjectID:    "test-project-a",
						ConfigRev:    testsupport.TestRevision,
						ConfigDigest: testsupport.TestContentHash,
						ConfigBody:   cfgBody,
					},
				}
				So(updateRealms(ctx, testsupport.PermissionsDB(false), revs, false, "latest config"), ShouldBeNil)
				So(taskScheduler.Tasks(), ShouldHaveLength, 2)

				expectedRealmsBody, _ := proto.Marshal(&protocol.Realms{
					Realms: []*protocol.Realm{
						{
							Name: "test-project-a:@root",
						},
						{
							Name: "test-project-a:test-realm",
						},
					},
				})

				fetchedPRealms, err := GetAuthProjectRealms(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealms, ShouldResemble, simpleProjectRealm(ctx, "a", expectedRealmsBody, 1))

				fetchedPRealmMeta, err := GetAuthProjectRealmsMeta(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealmMeta, ShouldResemble, simpleProjectRealmMeta(ctx, "a"))

				cfgBody, _ = prototext.Marshal(&realmsconf.RealmsCfg{
					Realms: []*realmsconf.Realm{
						{
							Name: "test-realm",
						},
						{
							Name: "test-realm-2",
						},
					},
				})

				revs = []*RealmsCfgRev{
					{
						ProjectID:    "test-project-a",
						ConfigRev:    testsupport.TestRevision,
						ConfigDigest: testsupport.TestContentHash,
						ConfigBody:   cfgBody,
					},
				}
				So(updateRealms(ctx, testsupport.PermissionsDB(false), revs, false, "latest config"), ShouldBeNil)
				So(taskScheduler.Tasks(), ShouldHaveLength, 4)

				expectedRealmsBody, _ = proto.Marshal(&protocol.Realms{
					Realms: []*protocol.Realm{
						{
							Name: "test-project-a:@root",
						},
						{
							Name: "test-project-a:test-realm",
						},
						{
							Name: "test-project-a:test-realm-2",
						},
					},
				})

				fetchedPRealms, err = GetAuthProjectRealms(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealms, ShouldResemble, simpleProjectRealm(ctx, "a", expectedRealmsBody, 2))

				fetchedPRealmMeta, err = GetAuthProjectRealmsMeta(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealmMeta, ShouldResemble, simpleProjectRealmMeta(ctx, "a"))
			})

			Convey("updating many projects", func() {
				cfgBody1, _ := prototext.Marshal(&realmsconf.RealmsCfg{
					Realms: []*realmsconf.Realm{
						{
							Name: "test-realm",
						},
						{
							Name: "test-realm-2",
						},
					},
				})

				cfgBody2, _ := prototext.Marshal(&realmsconf.RealmsCfg{
					Realms: []*realmsconf.Realm{
						{
							Name: "test-realm",
						},
						{
							Name: "test-realm-3",
						},
					},
				})

				revs := []*RealmsCfgRev{
					{
						ProjectID:    "test-project-a",
						ConfigRev:    testsupport.TestRevision,
						ConfigDigest: testsupport.TestContentHash,
						ConfigBody:   cfgBody1,
					},
					{
						ProjectID:    "test-project-b",
						ConfigRev:    testsupport.TestRevision,
						ConfigDigest: testsupport.TestContentHash,
						ConfigBody:   cfgBody2,
					},
				}
				So(updateRealms(ctx, testsupport.PermissionsDB(false), revs, false, "latest config"), ShouldBeNil)
				So(taskScheduler.Tasks(), ShouldHaveLength, 2)

				expectedRealmsBodyA, _ := proto.Marshal(&protocol.Realms{
					Realms: []*protocol.Realm{
						{
							Name: "test-project-a:@root",
						},
						{
							Name: "test-project-a:test-realm",
						},
						{
							Name: "test-project-a:test-realm-2",
						},
					},
				})

				expectedRealmsBodyB, _ := proto.Marshal(&protocol.Realms{
					Realms: []*protocol.Realm{
						{
							Name: "test-project-b:@root",
						},
						{
							Name: "test-project-b:test-realm",
						},
						{
							Name: "test-project-b:test-realm-3",
						},
					},
				})

				fetchedPRealmsA, err := GetAuthProjectRealms(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealmsA, ShouldResemble, simpleProjectRealm(ctx, "a", expectedRealmsBodyA, 1))

				fetchedPRealmsB, err := GetAuthProjectRealms(ctx, "test-project-b")
				So(err, ShouldBeNil)
				So(fetchedPRealmsB, ShouldResemble, simpleProjectRealm(ctx, "b", expectedRealmsBodyB, 1))

				fetchedPRealmMetaA, err := GetAuthProjectRealmsMeta(ctx, "test-project-a")
				So(err, ShouldBeNil)
				So(fetchedPRealmMetaA, ShouldResemble, simpleProjectRealmMeta(ctx, "a"))

				fetchedPRealmMetaB, err := GetAuthProjectRealmsMeta(ctx, "test-project-b")
				So(err, ShouldBeNil)
				So(fetchedPRealmMetaB, ShouldResemble, simpleProjectRealmMeta(ctx, "b"))
			})
		})
	})
}

func TestProcessRealmsConfigChanges(t *testing.T) {
	t.Parallel()

	Convey("testing realms config changes", t, func() {
		ctx := auth.WithState(gaemem.Use(context.Background()), &authtest.FakeState{
			Identity: "user:someone@example.com",
		})
		ctx = testsupport.SetTestContextSigner(ctx, "test-app-id", "test-app-id@example.com")
		ctx = clock.Set(ctx, testclock.New(testCreatedTS))
		ctx = info.SetImageVersion(ctx, "test-version")
		ctx, taskScheduler := tq.TestingContext(txndefer.FilterRDS(ctx), nil)

		permsDB := testsupport.PermissionsDB(false)
		configBody, _ := prototext.Marshal(&realmsconf.RealmsCfg{
			Realms: []*realmsconf.Realm{
				{
					Name: "test-realm",
				},
			},
		})

		// makeFetchedCfgRev returns a RealmsCfgRev for the project,
		// with only the fields that would be populated when fetching it
		// from LUCI Config.
		// from stored info.
		makeFetchedCfgRev := func(projectID string) *RealmsCfgRev {
			return &RealmsCfgRev{
				ProjectID:    projectID,
				ConfigRev:    testsupport.TestRevision,
				ConfigDigest: testsupport.TestContentHash,
				ConfigBody:   configBody,
				PermsRev:     "",
			}
		}

		// makeStoredCfgRev returns a RealmsCfgRev for the project,
		// with only the fields that would be populated when creating it
		// from stored info.
		makeStoredCfgRev := func(projectID string) *RealmsCfgRev {
			return &RealmsCfgRev{
				ProjectID:    projectID,
				ConfigRev:    testsupport.TestRevision,
				ConfigDigest: testsupport.TestContentHash,
				ConfigBody:   []byte{},
				PermsRev:     permsDB.Rev,
			}
		}

		// putProjectRealms stores an AuthProjectRealms into datastore
		// for the project.
		putProjectRealms := func(ctx context.Context, projectID string) error {
			return datastore.Put(ctx, &AuthProjectRealms{
				AuthVersionedEntityMixin: testAuthVersionedEntityMixin(),
				Kind:                     "AuthProjectRealms",
				ID:                       projectID,
				Parent:                   RootKey(ctx),
			})
		}

		// runJobs is a helper function to execute callbacks.
		runJobs := func(jobs []func() error) bool {
			success := true
			for _, job := range jobs {
				if err := job(); err != nil {
					success = false
				}
			}
			return success
		}

		Convey("no-op when up to date", func() {
			latest := []*RealmsCfgRev{
				makeFetchedCfgRev("@internal"),
				makeFetchedCfgRev("test-project-a"),
			}
			stored := []*RealmsCfgRev{
				makeStoredCfgRev("test-project-a"),
				makeStoredCfgRev("@internal"),
			}
			So(putProjectRealms(ctx, "test-project-a"), ShouldBeNil)
			So(putProjectRealms(ctx, "@internal"), ShouldBeNil)

			jobs, err := processRealmsConfigChanges(ctx, permsDB, latest, stored, false, "Updated from update-realms cron job")
			So(err, ShouldBeNil)
			So(jobs, ShouldBeEmpty)

			So(runJobs(jobs), ShouldBeTrue)
			So(taskScheduler.Tasks(), ShouldHaveLength, 0)
		})

		Convey("add realms for new project", func() {
			latest := []*RealmsCfgRev{
				makeFetchedCfgRev("@internal"),
				makeFetchedCfgRev("test-project-a"),
			}
			stored := []*RealmsCfgRev{
				makeStoredCfgRev("@internal"),
			}
			So(putProjectRealms(ctx, "@internal"), ShouldBeNil)

			jobs, err := processRealmsConfigChanges(ctx, permsDB, latest, stored, false, "Updated from update-realms cron job")
			So(err, ShouldBeNil)
			So(jobs, ShouldHaveLength, 1)

			So(runJobs(jobs), ShouldBeTrue)
			So(taskScheduler.Tasks(), ShouldHaveLength, 2)
		})

		Convey("update existing realms.cfg", func() {
			latest := []*RealmsCfgRev{
				makeFetchedCfgRev("@internal"),
				makeFetchedCfgRev("test-project-a"),
			}
			latest[1].ConfigDigest = "different-digest"
			stored := []*RealmsCfgRev{
				makeStoredCfgRev("test-project-a"),
				makeStoredCfgRev("@internal"),
			}
			So(putProjectRealms(ctx, "test-project-a"), ShouldBeNil)
			So(putProjectRealms(ctx, "@internal"), ShouldBeNil)

			jobs, err := processRealmsConfigChanges(ctx, permsDB, latest, stored, false, "Updated from update-realms cron job")
			So(err, ShouldBeNil)
			So(jobs, ShouldHaveLength, 1)

			So(runJobs(jobs), ShouldBeTrue)
			So(taskScheduler.Tasks(), ShouldHaveLength, 2)
		})

		Convey("delete project realms if realms.cfg no longer exists", func() {
			latest := []*RealmsCfgRev{
				makeFetchedCfgRev("@internal"),
			}
			stored := []*RealmsCfgRev{
				makeStoredCfgRev("test-project-a"),
				makeStoredCfgRev("@internal"),
			}
			So(putProjectRealms(ctx, "test-project-a"), ShouldBeNil)
			So(putProjectRealms(ctx, "@internal"), ShouldBeNil)

			jobs, err := processRealmsConfigChanges(ctx, permsDB, latest, stored, false, "Updated from update-realms cron job")
			So(err, ShouldBeNil)
			So(jobs, ShouldHaveLength, 1)

			So(runJobs(jobs), ShouldBeTrue)
			So(taskScheduler.Tasks(), ShouldHaveLength, 2)
		})

		Convey("update if there is a new revision of permissions", func() {
			latest := []*RealmsCfgRev{
				makeFetchedCfgRev("@internal"),
				makeFetchedCfgRev("test-project-a"),
			}
			stored := []*RealmsCfgRev{
				makeStoredCfgRev("test-project-a"),
				makeStoredCfgRev("@internal"),
			}
			stored[1].PermsRev = "permissions.cfg:old"
			So(putProjectRealms(ctx, "test-project-a"), ShouldBeNil)
			So(putProjectRealms(ctx, "@internal"), ShouldBeNil)

			jobs, err := processRealmsConfigChanges(ctx, permsDB, latest, stored, false, "Updated from update-realms cron job")
			So(err, ShouldBeNil)
			So(jobs, ShouldHaveLength, 1)

			So(runJobs(jobs), ShouldBeTrue)
			So(taskScheduler.Tasks(), ShouldHaveLength, 2)
		})

		Convey("AuthDB revisions are limited when permissions change", func() {
			projectCount := 3 * maxReevaluationRevisions
			latest := make([]*RealmsCfgRev, projectCount)
			stored := make([]*RealmsCfgRev, projectCount)
			for i := 0; i < projectCount; i++ {
				projectID := fmt.Sprintf("test-project-%d", i)
				latest[i] = makeFetchedCfgRev(projectID)
				stored[i] = makeStoredCfgRev(projectID)
				stored[i].PermsRev = "permissions.cfg:old"
				So(putProjectRealms(ctx, projectID), ShouldBeNil)
			}

			jobs, err := processRealmsConfigChanges(ctx, permsDB, latest, stored, false, "Updated from update-realms cron job")
			So(err, ShouldBeNil)
			So(jobs, ShouldHaveLength, maxReevaluationRevisions)

			So(runJobs(jobs), ShouldBeTrue)
			So(taskScheduler.Tasks(), ShouldHaveLength, 2*maxReevaluationRevisions)
		})
	})
}
