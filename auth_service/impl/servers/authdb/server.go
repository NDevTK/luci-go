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

// Package authdb contains methods to work with authdb.
package authdb

import (
	"context"
	"encoding/json"
	"strconv"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"go.chromium.org/luci/auth/identity"
	"go.chromium.org/luci/common/data/stringset"
	"go.chromium.org/luci/common/errors"
	"go.chromium.org/luci/common/logging"
	"go.chromium.org/luci/gae/service/datastore"
	"go.chromium.org/luci/server/auth"
	"go.chromium.org/luci/server/router"

	"go.chromium.org/luci/auth_service/api/rpcpb"
	"go.chromium.org/luci/auth_service/impl/model"
)

// Server implements AuthDB server.
type Server struct {
	rpcpb.UnimplementedAuthDBServer
}

type SnapshotJSON struct {
	AuthDBRev      int64  `json:"auth_db_rev"`
	AuthDBDeflated []byte `json:"deflated_body,omitempty"`
	AuthDBSha256   string `json:"sha256"`
	CreatedTS      int64  `json:"created_ts"`
}

// GetSnapshot implements the corresponding RPC method.
func (srv *Server) GetSnapshot(ctx context.Context, request *rpcpb.GetSnapshotRequest) (*rpcpb.Snapshot, error) {
	if request.Revision < 0 {
		return nil, status.Errorf(codes.InvalidArgument, "Negative revision numbers are not valid")
	} else if request.Revision == 0 {
		var err error
		if request.Revision, err = getLatestRevision(ctx, false); err != nil {
			logging.Errorf(ctx, err.Error())
			return nil, err
		}
	}

	switch snapshot, err := model.GetAuthDBSnapshot(ctx, request.Revision, request.SkipBody, false); {
	case err == nil:
		return snapshot.ToProto(), nil
	case errors.Is(err, datastore.ErrNoSuchEntity):
		return nil, status.Errorf(codes.NotFound, "AuthDB revision %v not found", request.Revision)
	default:
		errStr := "unknown error while calling GetAuthDBSnapshot"
		logging.Errorf(ctx, errStr)
		return nil, status.Errorf(codes.Internal, errStr)
	}
}

// getLatestRevision is a helper function to set the latest revision number for the GetSnapshotRequest.
func getLatestRevision(ctx context.Context, dryRun bool) (int64, error) {
	switch latest, err := model.GetAuthDBSnapshotLatest(ctx, dryRun); {
	case err == nil:
		return latest.AuthDBRev, nil
	case errors.Is(err, datastore.ErrNoSuchEntity):
		return 0, status.Errorf(codes.NotFound, "AuthDBSnapshotLatest not found")
	default:
		errStr := "unknown error while calling GetAuthDBSnapshotLatest"
		logging.Errorf(ctx, errStr)
		return 0, status.Errorf(codes.Internal, errStr)
	}
}

// getLegacyAuthDBSnapshot is a helper function to serve an AuthDBSnapshot or a
// V2AuthDBSnapshot.
func (srv *Server) getLegacyAuthDBSnapshot(ctx *router.Context, dryRun bool) error {
	c, r, w := ctx.Request.Context(), ctx.Request, ctx.Writer

	// Parse the `revID`  param for the requested AuthDB revision.
	var revID int64
	var err error
	revIDStr := ctx.Params.ByName("revID")
	switch revIDStr {
	case "", "latest":
		revID, err = getLatestRevision(c, dryRun)
		if err != nil {
			logging.Errorf(c, err.Error())
			return err
		}
	default:
		revID, err = strconv.ParseInt(revIDStr, 10, 64)
		if err != nil {
			err = errors.Annotate(err, "issue while parsing revID %s", revIDStr).Err()
			logging.Errorf(c, err.Error())
			return status.Errorf(codes.InvalidArgument, "unable to parse revID: %s", revIDStr)
		}

		if revID < 0 {
			return status.Errorf(codes.InvalidArgument, "Negative revision numbers are not valid")
		}
	}

	skipBody := r.URL.Query().Get("skip_body") == "1"
	snapshot, err := model.GetAuthDBSnapshot(c, revID, skipBody, dryRun)
	if err != nil {
		if errors.Is(err, datastore.ErrNoSuchEntity) {
			return status.Errorf(codes.NotFound, "AuthDB revision %d not found", revID)
		}

		exposedErr := "unknown error while calling GetAuthDBSnapshot"
		// Log the actual error so we can debug.
		logging.Errorf(c, "%s: %s", exposedErr, err)
		// Return only the exposed error message.
		return status.Errorf(codes.Internal, exposedErr)
	}

	blob, err := json.Marshal(map[string]any{
		"snapshot": SnapshotJSON{
			AuthDBRev:      snapshot.ID,
			AuthDBDeflated: snapshot.AuthDBDeflated,
			AuthDBSha256:   snapshot.AuthDBSha256,
			CreatedTS:      snapshot.CreatedTS.UnixMicro(),
		},
	})

	if err != nil {
		return errors.Annotate(err, "Error while marshaling JSON").Err()
	}

	if _, err = w.Write(blob); err != nil {
		return errors.Annotate(err, "Error while writing json").Err()
	}

	return nil
}

// HandleLegacyAuthDBServing handles the AuthDBSnapshot serving for legacy
// services. Writes the AuthDBSnapshot JSON to the router.Writer. gRPC Error is returned
// and adapted to HTTP format if operation is unsuccesful.
func (srv *Server) HandleLegacyAuthDBServing(ctx *router.Context) error {
	return srv.getLegacyAuthDBSnapshot(ctx, false)
}

// HandleV2AuthDBServing handles the V2AuthDBSnapshot serving for
// validation. Writes the V2AuthDBSnapshot JSON to the router.Writer.
// gRPC Error is returned and adapted to HTTP format if operation is
// unsuccessful.
//
// TODO: Remove this once we have fully rolled out Auth Service v2
// (b/321019030).
func (srv *Server) HandleV2AuthDBServing(ctx *router.Context) error {
	return srv.getLegacyAuthDBSnapshot(ctx, true)
}

// CheckLegacyMembership serves the legacy REST API GET request to check whether
// a given identity is a member of any of the given groups.
//
// Example query:
//
//	"identity=user:someone@example.com&groups=group-a&groups=group-b"
//
// Example response:
//
//	{
//	   "is_member": true
//	}
func (srv *Server) CheckLegacyMembership(ctx *router.Context) error {
	c, r, w := ctx.Request.Context(), ctx.Request, ctx.Writer
	params := r.URL.Query()

	// Validate the identity param.
	rawID := params.Get("identity")
	if rawID == "" {
		return status.Error(codes.InvalidArgument,
			"\"identity\" query parameter is required")
	}
	id, err := identity.MakeIdentity(rawID)
	if err != nil {
		return status.Errorf(codes.InvalidArgument,
			"Invalid \"identity\" - %s", err)
	}

	// Get all groups params (there may be multiple).
	rawNames, ok := params["groups"]
	if !ok {
		return status.Error(codes.InvalidArgument,
			"\"groups\" query parameter is required")
	}
	toCheck := stringset.New(len(rawNames))
	for _, name := range rawNames {
		if name != "" {
			toCheck.Add(name)
		}
	}
	if len(toCheck) == 0 {
		return status.Error(codes.InvalidArgument,
			"must specify at least one group to check membership")
	}

	s := auth.GetState(c)
	if s == nil {
		return status.Error(codes.Internal, "no auth state")
	}
	isMember, err := s.DB().IsMember(c, id, toCheck.ToSlice())
	if err != nil {
		return status.Errorf(codes.Internal, "error checking membership for %q",
			id)
	}

	err = json.NewEncoder(w).Encode(map[string]bool{
		"is_member": isMember,
	})
	if err != nil {
		return errors.Annotate(err, "error encoding JSON").Err()
	}

	return nil
}
