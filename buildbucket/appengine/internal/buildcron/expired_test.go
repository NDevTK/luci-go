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

package buildcron

import (
	"context"
	"sort"
	"testing"
	"time"

	"go.chromium.org/luci/common/clock/testclock"
	"go.chromium.org/luci/common/tsmon"
	"go.chromium.org/luci/common/tsmon/store"
	"go.chromium.org/luci/gae/filter/txndefer"
	"go.chromium.org/luci/gae/impl/memory"
	"go.chromium.org/luci/gae/service/datastore"
	"go.chromium.org/luci/server/tq"
	"go.chromium.org/luci/server/tq/tqtesting"

	"go.chromium.org/luci/buildbucket/appengine/internal/buildid"
	"go.chromium.org/luci/buildbucket/appengine/internal/metrics"
	"go.chromium.org/luci/buildbucket/appengine/model"
	taskdefs "go.chromium.org/luci/buildbucket/appengine/tasks/defs"
	pb "go.chromium.org/luci/buildbucket/proto"

	. "github.com/smartystreets/goconvey/convey"
	. "go.chromium.org/luci/common/testing/assertions"
)

// now needs to be further fresh enough from buildid.beginningOfTheWorld
var now = time.Date(2020, 01, 01, 0, 0, 0, 0, time.UTC)

func setUp() (context.Context, store.Store, *tqtesting.Scheduler) {
	ctx := memory.Use(context.Background())
	datastore.GetTestable(ctx).AutoIndex(true)
	datastore.GetTestable(ctx).Consistent(true)
	ctx = txndefer.FilterRDS(ctx)

	ctx, _ = tsmon.WithDummyInMemory(ctx)
	ctx = metrics.WithServiceInfo(ctx, "svc", "job", "ins")
	ctx = metrics.WithBuilder(ctx, "project", "bucket", "builder")
	ctx, _ = metrics.WithCustomMetrics(ctx, &pb.SettingsCfg{})
	store := tsmon.Store(ctx)
	ctx, sch := tq.TestingContext(ctx, nil)

	ctx, _ = testclock.UseTime(ctx, now)
	return ctx, store, sch
}

func newBuildAndStatus(ctx context.Context, st pb.Status, t time.Time) (*model.Build, *model.BuildStatus) {
	id := buildid.NewBuildIDs(ctx, t, 1)[0]
	b := &model.Build{
		ID: id,
		Proto: &pb.Build{
			Id: id,
			Builder: &pb.BuilderID{
				Project: "project",
				Bucket:  "bucket",
				Builder: "builder",
			},
			Status: st,
		},
	}
	bs := &model.BuildStatus{
		Build:  datastore.KeyForObj(ctx, b),
		Status: st,
	}
	return b, bs
}

func newInfraFromBuild(ctx context.Context, b *model.Build) *model.BuildInfra {
	return &model.BuildInfra{
		Build: datastore.KeyForObj(ctx, b),
		Proto: &pb.BuildInfra{
			Resultdb: &pb.BuildInfra_ResultDB{
				Hostname:   "rdbhost",
				Invocation: "inv",
			},
		},
	}
}

func TestTimeoutExpiredBuilds(t *testing.T) {
	t.Parallel()

	Convey("TimeoutExpiredBuilds", t, func() {
		ctx, store, sch := setUp()

		Convey("skips young, running builds", func() {
			b1, bs1 := newBuildAndStatus(ctx, pb.Status_SCHEDULED, now.Add(-model.BuildMaxCompletionTime))
			b2, bs2 := newBuildAndStatus(ctx, pb.Status_STARTED, now.Add(-model.BuildMaxCompletionTime))
			So(datastore.Put(ctx, b1, b2, bs1, bs2), ShouldBeNil)
			So(TimeoutExpiredBuilds(ctx), ShouldBeNil)

			b := &model.Build{ID: b1.ID}
			bs := &model.BuildStatus{Build: datastore.KeyForObj(ctx, b)}
			So(datastore.Get(ctx, b, bs), ShouldBeNil)
			So(b.Proto, ShouldResembleProto, b1.Proto)
			So(bs.Status, ShouldEqual, pb.Status_SCHEDULED)

			b = &model.Build{ID: b2.ID}
			bs = &model.BuildStatus{Build: datastore.KeyForObj(ctx, b)}
			So(datastore.Get(ctx, b, bs), ShouldBeNil)
			So(b.Proto, ShouldResembleProto, b2.Proto)
			So(bs.Status, ShouldEqual, pb.Status_STARTED)
		})

		Convey("skips old, completed builds", func() {
			b1, bs1 := newBuildAndStatus(ctx, pb.Status_SUCCESS, now.Add(-model.BuildMaxCompletionTime))
			b2, bs2 := newBuildAndStatus(ctx, pb.Status_FAILURE, now.Add(-model.BuildMaxCompletionTime))
			So(datastore.Put(ctx, b1, b2, bs1, bs2), ShouldBeNil)
			So(TimeoutExpiredBuilds(ctx), ShouldBeNil)

			b := &model.Build{ID: b1.ID}
			So(datastore.Get(ctx, b), ShouldBeNil)
			So(b.Proto, ShouldResembleProto, b1.Proto)

			b = &model.Build{ID: b2.ID}
			So(datastore.Get(ctx, b), ShouldBeNil)
			So(b.Proto, ShouldResembleProto, b2.Proto)
		})

		Convey("works w/ a large number of expired builds", func() {
			bs := make([]*model.Build, 128)
			bss := make([]*model.BuildStatus, len(bs))
			infs := make([]*model.BuildInfra, len(bs))
			createTime := now.Add(-model.BuildMaxCompletionTime - time.Minute)
			for i := 0; i < len(bs); i++ {
				bs[i], bss[i] = newBuildAndStatus(ctx, pb.Status_SCHEDULED, createTime)
				infs[i] = newInfraFromBuild(ctx, bs[i])
			}
			So(datastore.Put(ctx, bs), ShouldBeNil)
			So(datastore.Put(ctx, bss), ShouldBeNil)
			So(datastore.Put(ctx, infs), ShouldBeNil)
			So(TimeoutExpiredBuilds(ctx), ShouldBeNil)
		})

		Convey("marks old, running builds w/ infra_failure", func() {
			base := pb.CustomMetricBase_CUSTOM_METRIC_BASE_COMPLETED
			name := "/chrome/infra/custom/builds/completed"
			cm := &pb.CustomMetricDefinition{
				Name:       name,
				Predicates: []string{`build.status.to_string()=="INFRA_FAILURE"`},
				ExtraFields: map[string]string{
					"experiments": `build.input.experiments.to_string()`,
				},
			}
			cms := []model.CustomMetric{
				{
					Base:   base,
					Metric: cm,
				},
			}
			b1, bs1 := newBuildAndStatus(ctx, pb.Status_SCHEDULED, now.Add(-model.BuildMaxCompletionTime-time.Minute))
			inf1 := newInfraFromBuild(ctx, b1)
			b1.LegacyProperties.LeaseProperties.IsLeased = true
			b1.CustomMetrics = cms
			b2, bs2 := newBuildAndStatus(ctx, pb.Status_STARTED, now.Add(-model.BuildMaxCompletionTime-time.Minute))
			inf2 := newInfraFromBuild(ctx, b2)
			b2.CustomMetrics = cms
			So(datastore.Put(ctx, b1, b2, bs1, bs2, inf1, inf2), ShouldBeNil)

			globalCfg := &pb.SettingsCfg{
				CustomMetrics: []*pb.CustomMetric{
					{
						Name: name,
						Class: &pb.CustomMetric_MetricBase{
							MetricBase: base,
						},
						ExtraFields: []string{"experiments"},
					},
				},
			}
			ctx, _ = metrics.WithCustomMetrics(ctx, globalCfg)

			So(TimeoutExpiredBuilds(ctx), ShouldBeNil)

			b := &model.Build{ID: b1.ID}
			bs := &model.BuildStatus{Build: datastore.KeyForObj(ctx, b)}
			So(datastore.Get(ctx, b, bs), ShouldBeNil)
			So(b.Proto.Status, ShouldEqual, pb.Status_INFRA_FAILURE)
			So(b.LegacyProperties.LeaseProperties.IsLeased, ShouldBeFalse)
			So(b.Proto.StatusDetails.GetTimeout(), ShouldNotBeNil)
			So(bs.Status, ShouldEqual, pb.Status_INFRA_FAILURE)

			b = &model.Build{ID: b2.ID}
			bs = &model.BuildStatus{Build: datastore.KeyForObj(ctx, b)}
			So(datastore.Get(ctx, b, bs), ShouldBeNil)
			So(b.Proto.Status, ShouldEqual, pb.Status_INFRA_FAILURE)
			So(b.Proto.StatusDetails.GetTimeout(), ShouldNotBeNil)
			So(bs.Status, ShouldEqual, pb.Status_INFRA_FAILURE)

			Convey("reports metrics", func() {
				fv := []any{
					"INFRA_FAILURE", /* metric:status */
					"None",          /* metric:experiments */
				}
				So(store.Get(ctx, metrics.V2.BuildCountCompleted, time.Time{}, fv), ShouldEqual, 2)

				// Custom metrics
				res, err := metrics.GetCustomMetricsData(ctx, base, name, time.Time{}, fv)
				So(err, ShouldBeNil)
				So(res, ShouldEqual, 2)
			})

			Convey("adds TQ tasks", func() {
				// TQ tasks for pubsub-notification, bq-export, and invocation-finalization.
				tasks := sch.Tasks()
				notifyIDs := []int64{}
				bqIDs := []int64{}
				rdbIDs := []int64{}
				expected := []int64{b1.ID, b2.ID}
				notifyGoIDs := []int64{}

				for _, task := range tasks {
					switch v := task.Payload.(type) {
					case *taskdefs.NotifyPubSub:
						notifyIDs = append(notifyIDs, v.GetBuildId())
					case *taskdefs.ExportBigQueryGo:
						bqIDs = append(bqIDs, v.GetBuildId())
					case *taskdefs.FinalizeResultDBGo:
						rdbIDs = append(rdbIDs, v.GetBuildId())
					case *taskdefs.NotifyPubSubGoProxy:
						notifyGoIDs = append(notifyGoIDs, v.GetBuildId())

					default:
						panic("invalid task payload")
					}
				}

				sortIDs := func(ids []int64) {
					sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })
				}
				sortIDs(notifyIDs)
				sortIDs(bqIDs)
				sortIDs(rdbIDs)
				sortIDs(expected)
				sortIDs(notifyGoIDs)

				So(notifyIDs, ShouldHaveLength, 2)
				So(notifyIDs, ShouldResemble, expected)
				So(bqIDs, ShouldHaveLength, 2)
				So(bqIDs, ShouldResemble, expected)
				So(rdbIDs, ShouldHaveLength, 2)
				So(rdbIDs, ShouldResemble, expected)
				So(notifyGoIDs, ShouldHaveLength, 2)
				So(notifyGoIDs, ShouldResemble, expected)
			})
		})
	})
}
