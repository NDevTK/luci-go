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

package botapi

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"go.chromium.org/luci/swarming/server/botsrv"
)

// OAuthToken mints OAuth tokens to be used inside the task.
//
// TODO: Doc, implement.
func (srv *BotAPIServer) OAuthToken(ctx context.Context, body *UnimplementedRequest, r *botsrv.Request) (botsrv.Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "not implemented yet")
}

// IDToken mints ID tokens to be used inside the task.
//
// TODO: Doc, implement.
func (srv *BotAPIServer) IDToken(ctx context.Context, body *UnimplementedRequest, r *botsrv.Request) (botsrv.Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "not implemented yet")
}