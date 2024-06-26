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

// Package buildtoken provide related functions for generating and parsing build
// tokens.
package buildtoken

import (
	"context"
	"encoding/base64"
	"testing"

	"google.golang.org/protobuf/proto"

	pb "go.chromium.org/luci/buildbucket/proto"
	"go.chromium.org/luci/server/secrets"
	"go.chromium.org/luci/server/secrets/testsecrets"

	. "github.com/smartystreets/goconvey/convey"

	. "go.chromium.org/luci/common/testing/assertions"
)

func mkToken(ctx context.Context, buildID int64, purpose pb.TokenBody_Purpose) string {
	token, err := GenerateToken(ctx, buildID, purpose)
	So(err, ShouldBeNil)
	return token
}

func TestBuildToken(t *testing.T) {
	t.Parallel()

	Convey("build token", t, func() {
		secretStore := &testsecrets.Store{
			Secrets: map[string]secrets.Secret{
				"somekey": {Active: []byte("i r key")},
			},
		}
		ctx := secrets.Use(context.Background(), secretStore)
		ctx = secrets.GeneratePrimaryTinkAEADForTest(ctx)

		Convey("success (encrypted)", func() {
			bID := int64(123)
			token := mkToken(ctx, bID, pb.TokenBody_BUILD)
			tBody, err := parseToTokenBodyImpl(ctx, token, 123, pb.TokenBody_BUILD)
			So(err, ShouldBeNil)
			So(tBody.BuildId, ShouldEqual, bID)
			So(tBody.Purpose, ShouldEqual, pb.TokenBody_BUILD)
			So(len(tBody.State), ShouldNotEqual, 0)
		})

		Convey("wrong build", func() {
			bID := int64(123)
			token := mkToken(ctx, bID, pb.TokenBody_BUILD)
			_, err := parseToTokenBodyImpl(ctx, token, 321, pb.TokenBody_BUILD)
			So(err, ShouldErrLike, "token is for build 123")
		})

		Convey("skip build check", func() {
			bID := int64(123)
			token := mkToken(ctx, bID, pb.TokenBody_BUILD)
			tBody, err := parseToTokenBodyImpl(ctx, token, 0, pb.TokenBody_BUILD)
			So(err, ShouldBeNil)
			So(tBody, ShouldNotBeNil)
		})

		Convey("skip purpose check", func() {
			bID := int64(123)
			tBody, err := parseToTokenBodyImpl(ctx, mkToken(ctx, bID, pb.TokenBody_BUILD), bID)
			So(err, ShouldBeNil)
			So(tBody, ShouldNotBeNil)

			tBody, err = parseToTokenBodyImpl(ctx, mkToken(ctx, bID, pb.TokenBody_TASK), bID)
			So(err, ShouldBeNil)
			So(tBody, ShouldNotBeNil)
		})

		Convey("multi purpose check", func() {
			bID := int64(123)
			token := mkToken(ctx, bID, pb.TokenBody_BUILD)
			tBody, err := parseToTokenBodyImpl(ctx, token, bID, pb.TokenBody_TASK, pb.TokenBody_BUILD)
			So(err, ShouldBeNil)
			So(tBody, ShouldNotBeNil)

			tBody, err = parseToTokenBodyImpl(ctx, token, bID, pb.TokenBody_BUILD, pb.TokenBody_TASK)
			So(err, ShouldBeNil)
			So(tBody, ShouldNotBeNil)
		})

		Convey("wrong purpose", func() {
			bID := int64(123)
			token := mkToken(ctx, bID, pb.TokenBody_BUILD)
			_, err := parseToTokenBodyImpl(ctx, token, 123, pb.TokenBody_TASK)
			So(err, ShouldErrLike, "token is for purpose BUILD")

			_, err = parseToTokenBodyImpl(ctx, token, 123, pb.TokenBody_START_BUILD, pb.TokenBody_TASK)
			So(err, ShouldErrLike, "token is for purpose BUILD")
		})

		Convey("not base64 encoded token", func() {
			_, err := parseToTokenBodyImpl(ctx, "invalid token", 123, pb.TokenBody_BUILD)
			So(err, ShouldErrLike, "error decoding token")
		})

		Convey("bad base64 encoded token", func() {
			_, err := parseToTokenBodyImpl(ctx, "abckish", 123, pb.TokenBody_BUILD)
			So(err, ShouldErrLike, "error unmarshalling token")
		})

		Convey("unsupported token version", func() {
			tkBody := &pb.TokenBody{
				BuildId: 1,
				State:   []byte("random"),
			}
			tkBytes, err := proto.Marshal(tkBody)
			So(err, ShouldBeNil)
			tkEnvelop := &pb.TokenEnvelope{
				Version: pb.TokenEnvelope_VERSION_UNSPECIFIED,
				Payload: tkBytes,
			}
			tkeBytes, err := proto.Marshal(tkEnvelop)
			So(err, ShouldBeNil)
			_, err = parseToTokenBodyImpl(ctx, base64.RawURLEncoding.EncodeToString(tkeBytes), 123, pb.TokenBody_BUILD)
			So(err, ShouldErrLike, "token with version 0 is not supported")
		})
	})
}
