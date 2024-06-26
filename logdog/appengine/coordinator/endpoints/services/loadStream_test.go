// Copyright 2015 The LUCI Authors.
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

package services

import (
	"errors"
	"testing"
	"time"

	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/durationpb"

	"go.chromium.org/luci/gae/filter/featureBreaker"
	logdog "go.chromium.org/luci/logdog/api/endpoints/coordinator/services/v1"
	"go.chromium.org/luci/logdog/appengine/coordinator"
	ct "go.chromium.org/luci/logdog/appengine/coordinator/coordinatorTest"

	. "github.com/smartystreets/goconvey/convey"

	. "go.chromium.org/luci/common/testing/assertions"
)

func TestLoadStream(t *testing.T) {
	t.Parallel()

	Convey(`With a testing configuration`, t, func() {
		c, env := ct.Install()

		svr := New(ServerSettings{NumQueues: 2})

		// Register a test stream.
		env.AddProject(c, "proj-foo")
		tls := ct.MakeStream(c, "proj-foo", "some-realm", "testing/+/foo/bar")
		if err := tls.Put(c); err != nil {
			panic(err)
		}

		// Prepare a request to load the test stream.
		req := &logdog.LoadStreamRequest{
			Project: string(tls.Project),
			Id:      string(tls.Stream.ID),
		}

		Convey(`Returns Forbidden error if not a service.`, func() {
			_, err := svr.LoadStream(c, &logdog.LoadStreamRequest{})
			So(err, ShouldBeRPCPermissionDenied)
		})

		Convey(`When logged in as a service`, func() {
			env.ActAsService()

			Convey(`Will succeed.`, func() {
				resp, err := svr.LoadStream(c, req)
				So(err, ShouldBeNil)
				So(resp, ShouldResembleProto, &logdog.LoadStreamResponse{
					State: &logdog.InternalLogStreamState{
						ProtoVersion:  "1",
						TerminalIndex: -1,
						Secret:        tls.State.Secret,
					},
					Age: durationpb.New(0),
				})
			})

			Convey(`Will return archival properties.`, func() {
				// Add an hour to the clock. Created is +0, Updated is +1hr.
				env.Clock.Add(1 * time.Hour)
				tls.State.ArchivalKey = []byte("archival key")
				tls.Reload(c)
				if err := tls.Put(c); err != nil {
					panic(err)
				}

				// Set time to +2hr, age should now be 1hr.
				env.Clock.Add(1 * time.Hour)
				resp, err := svr.LoadStream(c, req)
				So(err, ShouldBeNil)
				So(resp, ShouldResembleProto, &logdog.LoadStreamResponse{
					State: &logdog.InternalLogStreamState{
						ProtoVersion:  "1",
						TerminalIndex: -1,
						Secret:        tls.State.Secret,
					},
					ArchivalKey: []byte("archival key"),
					Age:         durationpb.New(1 * time.Hour),
				})
			})

			Convey(`Will succeed, and return the descriptor when requested.`, func() {
				req.Desc = true

				d, err := proto.Marshal(tls.Desc)
				if err != nil {
					panic(err)
				}

				resp, err := svr.LoadStream(c, req)
				So(err, ShouldBeNil)
				So(resp, ShouldResembleProto, &logdog.LoadStreamResponse{
					State: &logdog.InternalLogStreamState{
						ProtoVersion:  "1",
						TerminalIndex: -1,
						Secret:        tls.State.Secret,
					},
					Desc: d,
					Age:  durationpb.New(0),
				})
			})

			Convey(`Will return InvalidArgument if the stream hash is not valid.`, func() {
				req.Id = string("!!! not a hash !!!")

				_, err := svr.LoadStream(c, req)
				So(err, ShouldBeRPCInvalidArgument, "Invalid ID")
			})

			Convey(`Will return NotFound for non-existent streams.`, func() {
				req.Id = string(coordinator.LogStreamID("this/stream/+/does/not/exist"))

				_, err := svr.LoadStream(c, req)
				So(err, ShouldBeRPCNotFound)
			})

			Convey(`Will return Internal for random datastore failures.`, func() {
				c, fb := featureBreaker.FilterRDS(c, nil)
				fb.BreakFeatures(errors.New("test error"), "GetMulti")

				_, err := svr.LoadStream(c, req)
				So(err, ShouldBeRPCInternal)
			})
		})
	})
}
