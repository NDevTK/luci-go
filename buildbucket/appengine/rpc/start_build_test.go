// Copyright 2023 The LUCI Authors.
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

package rpc

import (
	"context"
	"testing"

	"google.golang.org/grpc/metadata"

	"go.chromium.org/luci/gae/filter/txndefer"
	"go.chromium.org/luci/gae/impl/memory"
	"go.chromium.org/luci/gae/service/datastore"
	"go.chromium.org/luci/server/tq"
	"go.chromium.org/luci/server/tq/tqtesting"

	"go.chromium.org/luci/buildbucket"
	"go.chromium.org/luci/buildbucket/appengine/internal/buildtoken"
	"go.chromium.org/luci/buildbucket/appengine/internal/metrics"
	"go.chromium.org/luci/buildbucket/appengine/model"
	pb "go.chromium.org/luci/buildbucket/proto"

	. "github.com/smartystreets/goconvey/convey"
	. "go.chromium.org/luci/common/testing/assertions"
)

func validStartBuildRequest() *pb.StartBuildRequest {
	return &pb.StartBuildRequest{
		RequestId: "random",
		BuildId:   87654321,
		TaskId:    "deadbeef",
	}
}

func TestValidateStartBuildRequest(t *testing.T) {
	t.Parallel()
	Convey("validateStartBuildRequest", t, func() {
		ctx := context.Background()

		Convey("empty req", func() {
			err := validateStartBuildRequest(ctx, &pb.StartBuildRequest{})
			So(err, ShouldErrLike, `.request_id: required`)
		})

		Convey("missing build id", func() {
			req := &pb.StartBuildRequest{
				RequestId: "random",
			}
			err := validateStartBuildRequest(ctx, req)
			So(err, ShouldErrLike, `.build_id: required`)
		})

		Convey("missing task id", func() {
			req := &pb.StartBuildRequest{
				RequestId: "random",
				BuildId:   87654321,
			}
			err := validateStartBuildRequest(ctx, req)
			So(err, ShouldErrLike, `.task_id: required`)
		})

		Convey("pass", func() {
			req := validStartBuildRequest()
			err := validateStartBuildRequest(ctx, req)
			So(err, ShouldBeNil)
		})
	})
}

func TestStartBuild(t *testing.T) {
	srv := &Builds{}
	ctx := memory.Use(context.Background())
	req := validStartBuildRequest()
	Convey("validate token", t, func() {
		Convey("token missing", func() {
			_, err := srv.StartBuild(ctx, req)
			So(err, ShouldErrLike, `token is missing`)
		})

		Convey("wrong purpose", func() {
			tk, _ := buildtoken.GenerateToken(ctx, 87654321, pb.TokenBody_TASK)
			ctx = metadata.NewIncomingContext(ctx, metadata.Pairs(buildbucket.BuildbucketTokenHeader, tk))
			_, err := srv.StartBuild(ctx, req)
			So(err, ShouldErrLike, `token is for purpose TASK`)
		})

		Convey("wrong build id", func() {
			tk, _ := buildtoken.GenerateToken(ctx, 1, pb.TokenBody_START_BUILD)
			ctx = metadata.NewIncomingContext(ctx, metadata.Pairs(buildbucket.BuildbucketTokenHeader, tk))
			_, err := srv.StartBuild(ctx, req)
			So(err, ShouldErrLike, `token is for build 1, but expected 87654321`)
		})
	})

	Convey("StartBuild", t, func() {
		ctx = metrics.WithServiceInfo(ctx, "svc", "job", "ins")
		ctx = txndefer.FilterRDS(ctx)
		var sch *tqtesting.Scheduler
		ctx, sch = tq.TestingContext(ctx, nil)

		build := &model.Build{
			ID: 87654321,
			Proto: &pb.Build{
				Id: 87654321,
				Builder: &pb.BuilderID{
					Project: "project",
					Bucket:  "bucket",
					Builder: "builder",
				},
				Status: pb.Status_SCHEDULED,
			},
			Status: pb.Status_SCHEDULED,
		}
		bk := datastore.KeyForObj(ctx, build)
		infra := &model.BuildInfra{
			Build: bk,
			Proto: &pb.BuildInfra{},
		}
		So(datastore.Put(ctx, build, infra), ShouldBeNil)

		Convey("build on backend", func() {
			tk, _ := buildtoken.GenerateToken(ctx, 87654321, pb.TokenBody_START_BUILD)
			ctx = metadata.NewIncomingContext(ctx, metadata.Pairs(buildbucket.BuildbucketTokenHeader, tk))

			Convey("build not on backend", func() {
				_, err := srv.StartBuild(ctx, req)
				So(err, ShouldErrLike, `the build 87654321 does not run on task backend`)
			})

			Convey("first StartBuild", func() {
				Convey("first handshake", func() {
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
							},
						},
					}
					So(datastore.Put(ctx, infra), ShouldBeNil)
					res, err := srv.StartBuild(ctx, req)
					So(err, ShouldBeNil)

					build, err = getBuild(ctx, 87654321)
					So(err, ShouldBeNil)
					So(build.UpdateToken, ShouldEqual, res.UpdateBuildToken)
					So(build.StartBuildRequestID, ShouldEqual, req.RequestId)
					So(build.Status, ShouldEqual, pb.Status_STARTED)

					err = datastore.Get(ctx, infra)
					So(err, ShouldBeNil)
					So(infra.Proto.Backend.Task.Id.Id, ShouldEqual, req.TaskId)

					// TQ tasks for pubsub-notification.
					tasks := sch.Tasks()
					So(tasks, ShouldHaveLength, 2)
				})

				Convey("same task", func() {
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
								Id:     req.TaskId,
							},
						},
					}
					So(datastore.Put(ctx, infra), ShouldBeNil)
					res, err := srv.StartBuild(ctx, req)
					So(err, ShouldBeNil)

					build, err = getBuild(ctx, 87654321)
					So(err, ShouldBeNil)
					So(build.UpdateToken, ShouldEqual, res.UpdateBuildToken)
					So(build.StartBuildRequestID, ShouldEqual, req.RequestId)
					So(build.Status, ShouldEqual, pb.Status_STARTED)

					// TQ tasks for pubsub-notification.
					tasks := sch.Tasks()
					So(tasks, ShouldHaveLength, 2)
				})

				Convey("after RegisterBuildTask", func() {
					Convey("duplicated task", func() {
						infra.Proto.Backend = &pb.BuildInfra_Backend{
							Task: &pb.Task{
								Id: &pb.TaskID{
									Target: "swarming://swarming-host",
									Id:     "other",
								},
							},
						}
						So(datastore.Put(ctx, infra), ShouldBeNil)
						_, err := srv.StartBuild(ctx, req)
						So(err, ShouldErrLike, `build 87654321 has associated with task "other"`)
						So(buildbucket.DuplicateTask.In(err), ShouldBeTrue)
						build, err = getBuild(ctx, 87654321)
						So(err, ShouldBeNil)
						So(build.UpdateToken, ShouldEqual, "")
						So(build.StartBuildRequestID, ShouldEqual, "")
						So(build.Status, ShouldEqual, pb.Status_SCHEDULED)

						// TQ tasks for pubsub-notification.
						tasks := sch.Tasks()
						So(tasks, ShouldHaveLength, 0)
					})

					Convey("same task", func() {
						infra.Proto.Backend = &pb.BuildInfra_Backend{
							Task: &pb.Task{
								Id: &pb.TaskID{
									Target: "swarming://swarming-host",
									Id:     req.TaskId,
								},
							},
						}
						So(datastore.Put(ctx, infra), ShouldBeNil)
						res, err := srv.StartBuild(ctx, req)
						So(err, ShouldBeNil)

						build, err = getBuild(ctx, 87654321)
						So(err, ShouldBeNil)
						So(build.UpdateToken, ShouldEqual, res.UpdateBuildToken)
						So(build.StartBuildRequestID, ShouldEqual, req.RequestId)
						So(build.Status, ShouldEqual, pb.Status_STARTED)
					})
				})

				Convey("build has started", func() {
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
							},
						},
					}
					build.Proto.Status = pb.Status_STARTED
					So(datastore.Put(ctx, infra, build), ShouldBeNil)
					_, err := srv.StartBuild(ctx, req)
					So(err, ShouldErrLike, `cannot start started build`)
				})

				Convey("build has ended", func() {
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
							},
						},
					}
					build.Proto.Status = pb.Status_FAILURE
					So(datastore.Put(ctx, infra, build), ShouldBeNil)
					_, err := srv.StartBuild(ctx, req)
					So(err, ShouldErrLike, `cannot start ended build`)
				})
			})

			Convey("subsequent StartBuild", func() {
				Convey("duplicate task", func() {
					build.StartBuildRequestID = "other request"
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
								Id:     "another",
							},
						},
					}
					So(datastore.Put(ctx, []any{build, infra}), ShouldBeNil)

					_, err := srv.StartBuild(ctx, req)
					So(err, ShouldErrLike, `build 87654321 has recorded another StartBuild with request id "other request"`)
					So(buildbucket.DuplicateTask.In(err), ShouldBeTrue)
				})

				Convey("task with collided request id", func() {
					build.StartBuildRequestID = req.RequestId
					var err error
					tok, err := buildtoken.GenerateToken(ctx, build.ID, pb.TokenBody_BUILD)
					So(err, ShouldBeNil)
					build.UpdateToken = tok
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
								Id:     "another",
							},
						},
					}
					So(datastore.Put(ctx, []any{build, infra}), ShouldBeNil)

					_, err = srv.StartBuild(ctx, req)
					So(err, ShouldErrLike, `build 87654321 has associated with task id "another" with StartBuild request id "random"`)
					So(buildbucket.TaskWithCollidedRequestID.In(err), ShouldBeTrue)
				})

				Convey("idempotent", func() {
					build.StartBuildRequestID = req.RequestId
					var err error
					tok, err := buildtoken.GenerateToken(ctx, build.ID, pb.TokenBody_BUILD)
					So(err, ShouldBeNil)
					build.UpdateToken = tok
					build.Proto.Status = pb.Status_STARTED
					infra.Proto.Backend = &pb.BuildInfra_Backend{
						Task: &pb.Task{
							Id: &pb.TaskID{
								Target: "swarming://swarming-host",
								Id:     req.TaskId,
							},
						},
					}
					So(datastore.Put(ctx, []any{build, infra}), ShouldBeNil)

					res, err := srv.StartBuild(ctx, req)
					So(err, ShouldBeNil)
					So(res.UpdateBuildToken, ShouldEqual, tok)
				})
			})
		})

		Convey("build on swarming", func() {
			tk, _ := buildtoken.GenerateToken(ctx, 87654321, pb.TokenBody_BUILD)
			ctx = metadata.NewIncomingContext(ctx, metadata.Pairs(buildbucket.BuildbucketTokenHeader, tk))

			Convey("build token missing", func() {
				_, err := srv.StartBuild(ctx, req)
				So(err, ShouldErrLike, `not found`)
			})

			Convey("build token mismatch", func() {
				build.UpdateToken = "different"
				So(datastore.Put(ctx, build), ShouldBeNil)
				_, err := srv.StartBuild(ctx, req)
				So(err, ShouldErrLike, `not found`)
			})

			Convey("StartBuild", func() {
				build.UpdateToken = tk
				So(datastore.Put(ctx, build), ShouldBeNil)
				Convey("build not on swarming", func() {
					_, err := srv.StartBuild(ctx, req)
					So(err, ShouldErrLike, `the build 87654321 does not run on swarming`)
				})

				Convey("first StartBuild", func() {
					Convey("first handshake", func() {
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: req.TaskId,
						}
						So(datastore.Put(ctx, infra), ShouldBeNil)
						res, err := srv.StartBuild(ctx, req)
						So(err, ShouldBeNil)

						build, err = getBuild(ctx, 87654321)
						So(err, ShouldBeNil)
						So(build.UpdateToken, ShouldEqual, res.UpdateBuildToken)
						So(build.StartBuildRequestID, ShouldEqual, req.RequestId)
						So(build.Status, ShouldEqual, pb.Status_STARTED)

						// TQ tasks for pubsub-notification.
						tasks := sch.Tasks()
						So(tasks, ShouldHaveLength, 2)
					})

					Convey("duplicated task", func() {
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: "another",
						}
						So(datastore.Put(ctx, infra), ShouldBeNil)
						_, err := srv.StartBuild(ctx, req)
						So(err, ShouldErrLike, `build 87654321 has associated with task "another"`)
						So(buildbucket.DuplicateTask.In(err), ShouldBeTrue)

						// TQ tasks for pubsub-notification.
						tasks := sch.Tasks()
						So(tasks, ShouldHaveLength, 0)
					})

					Convey("build has started", func() {
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: req.TaskId,
						}
						build.Proto.Status = pb.Status_STARTED
						So(datastore.Put(ctx, infra, build), ShouldBeNil)
						_, err := srv.StartBuild(ctx, req)
						So(err, ShouldErrLike, `cannot start started build`)
					})

					Convey("build has ended", func() {
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: req.TaskId,
						}
						build.Proto.Status = pb.Status_FAILURE
						So(datastore.Put(ctx, infra, build), ShouldBeNil)
						_, err := srv.StartBuild(ctx, req)
						So(err, ShouldErrLike, `cannot start ended build`)
					})
				})

				Convey("subsequent StartBuild", func() {
					Convey("duplicate task", func() {
						build.StartBuildRequestID = "other request"
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: "another",
						}
						So(datastore.Put(ctx, []any{build, infra}), ShouldBeNil)

						_, err := srv.StartBuild(ctx, req)
						So(err, ShouldErrLike, `build 87654321 has recorded another StartBuild with request id "other request"`)
						So(buildbucket.DuplicateTask.In(err), ShouldBeTrue)
					})

					Convey("task with collided request id", func() {
						build.StartBuildRequestID = req.RequestId
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: "another",
						}
						So(datastore.Put(ctx, []any{build, infra}), ShouldBeNil)

						_, err := srv.StartBuild(ctx, req)
						So(err, ShouldErrLike, `build 87654321 has associated with task id "another" with StartBuild request id "random"`)
						So(buildbucket.TaskWithCollidedRequestID.In(err), ShouldBeTrue)
					})

					Convey("idempotent", func() {
						build.StartBuildRequestID = req.RequestId
						build.Proto.Status = pb.Status_STARTED
						infra.Proto.Swarming = &pb.BuildInfra_Swarming{
							TaskId: req.TaskId,
						}
						So(datastore.Put(ctx, []any{build, infra}), ShouldBeNil)

						res, err := srv.StartBuild(ctx, req)
						So(err, ShouldBeNil)
						So(res.UpdateBuildToken, ShouldEqual, tk)
					})
				})
			})
		})
	})
}