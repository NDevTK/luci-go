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

package resultdb

import (
	"context"
	"strings"
	"testing"
	"time"

	"google.golang.org/protobuf/types/known/timestamppb"

	"go.chromium.org/luci/common/errors"
	"go.chromium.org/luci/server/auth"
	"go.chromium.org/luci/server/auth/authtest"

	"go.chromium.org/luci/resultdb/internal"
	"go.chromium.org/luci/resultdb/internal/artifacts"
	artifactstestutil "go.chromium.org/luci/resultdb/internal/artifacts/testutil"
	"go.chromium.org/luci/resultdb/internal/testutil"
	pb "go.chromium.org/luci/resultdb/proto/v1"
	"go.chromium.org/luci/resultdb/rdbperms"

	. "github.com/smartystreets/goconvey/convey"
	. "go.chromium.org/luci/common/testing/assertions"
)

func TestQueryInvocationVariantArtifacts(t *testing.T) {
	Convey("QueryInvocationVariantArtifacts", t, func() {
		ctx := auth.WithState(testutil.SpannerTestContext(t), &authtest.FakeState{
			Identity: "user:someone@example.com",
			IdentityPermissions: []authtest.RealmPermission{
				{Realm: "testproject:testrealm1", Permission: rdbperms.PermListArtifacts},
				{Realm: "testproject:testrealm2", Permission: rdbperms.PermListArtifacts},
			},
		})
		bqClient := artifactstestutil.NewMockBQClient(nil,
			func(ctx context.Context, opts artifacts.ReadArtifactsOpts) ([]*artifacts.MatchingArtifact, string, error) {
				return []*artifacts.MatchingArtifact{
					{
						InvocationID:           "12345678901234567890",
						PartitionTime:          time.Date(2024, 5, 6, 5, 58, 57, 490076000, time.UTC),
						Match:                  "log line 1",
						MatchWithContextBefore: "log line 0",
						MatchWithContextAfter:  "log line 2",
					},
					{
						InvocationID:           "12345678901234567891",
						PartitionTime:          time.Date(2024, 5, 6, 5, 58, 57, 491037000, time.UTC),
						Match:                  "log line 3",
						MatchWithContextBefore: "log line 2",
						MatchWithContextAfter:  "log line 4",
					},
				}, "", nil
			},
		)
		srv := pb.DecoratedResultDB{
			Service: &resultDBServer{
				artifactBQClient: bqClient,
			},
			Postlude: internal.CommonPostlude,
		}
		req := &pb.QueryInvocationVariantArtifactsRequest{
			Project:          "testproject",
			ArtifactId:       "artifact_id",
			VariantUnionHash: strings.Repeat("a", 16),
			SearchString: &pb.ArtifactContentMatcher{
				Matcher: &pb.ArtifactContentMatcher_RegexContain{
					RegexContain: "log line [13]",
				},
			},
			StartTime: timestamppb.New(time.Date(2024, 5, 5, 0, 0, 0, 0, time.UTC)),
			EndTime:   timestamppb.New(time.Date(2024, 5, 7, 0, 0, 0, 0, time.UTC)),
			PageSize:  10,
		}
		Convey("no permission", func() {
			req.Project = "nopermissionproject"
			res, err := srv.QueryInvocationVariantArtifacts(ctx, req)
			So(err, ShouldBeRPCPermissionDenied, "caller does not have permission resultdb.artifacts.list in any realm in project \"nopermissionproject\"")
			So(res, ShouldBeNil)
		})

		Convey("invalid request", func() {
			req.StartTime = nil
			res, err := srv.QueryInvocationVariantArtifacts(ctx, req)
			So(err, ShouldBeRPCInvalidArgument, `start_time: unspecified`)
			So(res, ShouldBeNil)
		})

		Convey("Valid request", func() {
			rsp, err := srv.QueryInvocationVariantArtifacts(ctx, req)
			So(err, ShouldBeNil)
			So(rsp, ShouldResembleProto, &pb.QueryInvocationVariantArtifactsResponse{
				Artifacts: []*pb.ArtifactMatchingContent{{
					Name:          "invocations/12345678901234567890/artifacts/artifact_id",
					PartitionTime: timestamppb.New(time.Date(2024, 5, 6, 5, 58, 57, 490076000, time.UTC)),
					Snippet:       "log line 0log line 1log line 2",
					Matches: []*pb.ArtifactMatchingContent_Match{{
						StartIndex: 10,
						EndIndex:   20,
					}},
				},
					{
						Name:          "invocations/12345678901234567891/artifacts/artifact_id",
						PartitionTime: timestamppb.New(time.Date(2024, 5, 6, 5, 58, 57, 491037000, time.UTC)),
						Snippet:       "log line 2log line 3log line 4",
						Matches: []*pb.ArtifactMatchingContent_Match{{
							StartIndex: 10,
							EndIndex:   20,
						}},
					}},
				NextPageToken: "",
			})
		})

		Convey("BQClient returns error", func() {
			bqClient := artifactstestutil.NewMockBQClient(nil,
				func(ctx context.Context, opts artifacts.ReadArtifactsOpts) ([]*artifacts.MatchingArtifact, string, error) {
					return nil, "", errors.New("BQClient error")
				},
			)
			srv := &resultDBServer{
				artifactBQClient: bqClient,
			}
			_, err := srv.QueryInvocationVariantArtifacts(ctx, req)
			So(err, ShouldNotBeNil)
			So(err.Error(), ShouldContainSubstring, "read artifacts")
		})
	})
}

func TestValidateQueryInvocationVariantArtifactsRequest(t *testing.T) {
	Convey("ValidateQueryInvocationVariantArtifactsRequest", t, func() {
		req := &pb.QueryInvocationVariantArtifactsRequest{
			Project:          "testproject",
			VariantUnionHash: strings.Repeat("a", 16),
			ArtifactId:       "artifact_id",
			SearchString: &pb.ArtifactContentMatcher{
				Matcher: &pb.ArtifactContentMatcher_RegexContain{
					RegexContain: "foo",
				},
			},
			StartTime: timestamppb.New(time.Date(2024, 5, 5, 0, 0, 0, 0, time.UTC)),
			EndTime:   timestamppb.New(time.Date(2024, 5, 7, 0, 0, 0, 0, time.UTC)),
			PageSize:  10,
		}
		Convey("Valid request", func() {
			err := validateQueryInvocationVariantArtifactsRequest(req)
			So(err, ShouldBeNil)
		})

		Convey("Invalid request", func() {
			Convey("Invalid project", func() {
				req.Project = "invalid_project"
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "project")
			})

			Convey("Search string unspecified", func() {
				req.SearchString = &pb.ArtifactContentMatcher{}
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "search_string: unspecified")
			})

			Convey("Invalid variant union hash", func() {
				req.VariantUnionHash = "varianthash"
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "variant_union_hash")
			})

			Convey("Invalid artifact_id", func() {
				req.ArtifactId = "invalid-artifact-id-\r"
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "artifact_id")
			})

			Convey("Start time unspecified", func() {
				req.StartTime = nil
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "start_time: unspecified")
			})

			Convey("End time unspecified", func() {
				req.EndTime = nil
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "end_time: unspecified")
			})

			Convey("Start time after end time", func() {
				req.StartTime = timestamppb.New(time.Date(2024, 5, 7, 0, 0, 0, 0, time.UTC))
				req.EndTime = timestamppb.New(time.Date(2024, 5, 5, 0, 0, 0, 0, time.UTC))
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "start time must not be later than end time")
			})

			Convey("Time difference greater than 7 days", func() {
				req.StartTime = timestamppb.New(time.Date(2024, 5, 1, 0, 0, 0, 0, time.UTC))
				req.EndTime = timestamppb.New(time.Date(2024, 5, 9, 0, 0, 0, 0, time.UTC))
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "difference between start_time and end_time must not be greater than 7 days")
			})

			Convey("Invalid page size", func() {
				req.PageSize = -1
				err := validateQueryInvocationVariantArtifactsRequest(req)
				So(err, ShouldNotBeNil)
				So(err.Error(), ShouldContainSubstring, "page_size: negative")
			})
		})
	})
}
