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

// Package status manages status values.
package status

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"regexp"
	"time"
	"unicode"
	"unicode/utf8"

	"cloud.google.com/go/spanner"
	"golang.org/x/text/unicode/norm"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"

	"go.chromium.org/luci/common/errors"
	"go.chromium.org/luci/server/span"

	pb "go.chromium.org/luci/tree_status/proto/v1"
)

const (
	// TreeNameExpression is a partial regular expression that validates tree identifiers.
	TreeNameExpression = `[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?`
	// StatusIDExpression is a partial regular expression that validates status identifiers.
	StatusIDExpression = `[0-9a-f]{32}`
)

// NotExistsErr is returned when the requested object was not found in the database.
var NotExistsErr error = errors.New("status value was not found")

// Status mirrors the structure of status values in the database.
type Status struct {
	// The name of the tree this status is part of.
	TreeName string
	// The unique identifier for the status. This is a randomly generated
	// 128-bit ID, encoded as 32 lowercase hexadecimal characters.
	StatusID string
	// The general state of the tree.
	GeneralStatus pb.GeneralState
	// The message explaining details about the status.
	Message string
	// The username of the user who added this.  Will be
	// set to 'user' after the username TTL (of 30 days).
	CreateUser string
	// The time the status update was made.
	// If filling this in from commit timestamp, make sure to call .UTC(), i.e.
	// status.CreateTime = timestamp.UTC()
	CreateTime time.Time
}

// Validate validates a status value.
// It ignores the CreateUser and CreateTime fields.
// Reported field names are as they appear in the RPC documentation rather than the Go struct.
func Validate(status *Status) error {
	if err := validateTreeName(status.TreeName); err != nil {
		return errors.Annotate(err, "tree").Err()
	}
	if err := validateID(status.StatusID); err != nil {
		return errors.Annotate(err, "id").Err()
	}
	if err := validateGeneralStatus(status.GeneralStatus); err != nil {
		return errors.Annotate(err, "general_state").Err()
	}
	if err := validateMessage(status.Message); err != nil {
		return errors.Annotate(err, "message").Err()
	}
	return nil
}

var treeNameRE = regexp.MustCompile(`^` + TreeNameExpression + `$`)

func validateTreeName(treeName string) error {
	if treeName == "" {
		return errors.Reason("must be specified").Err()
	}
	if !treeNameRE.MatchString(treeName) {
		return errors.Reason("expected format: %s", treeNameRE).Err()
	}
	return nil
}

var statusIDRE = regexp.MustCompile(`^` + StatusIDExpression + `$`)

func validateID(id string) error {
	if id == "" {
		return errors.Reason("must be specified").Err()
	}
	if !statusIDRE.MatchString(id) {
		return errors.Reason("expected format: %s", statusIDRE).Err()
	}
	return nil
}

func validateGeneralStatus(state pb.GeneralState) error {
	if state == pb.GeneralState_GENERAL_STATE_UNSPECIFIED {
		return errors.Reason("must be specified").Err()
	}
	if _, ok := pb.GeneralState_name[int32(state)]; !ok {
		return errors.Reason("invalid enum value").Err()
	}
	return nil
}

func validateMessage(message string) error {
	if message == "" {
		return errors.Reason("must be specified").Err()
	}
	if len(message) > 1024 {
		return errors.Reason("longer than 1024 bytes").Err()
	}
	if !utf8.ValidString(message) {
		return errors.Reason("not a valid utf8 string").Err()
	}
	if !norm.NFC.IsNormalString(message) {
		return errors.Reason("not in unicode normalized form C").Err()
	}
	for i, rune := range message {
		if !unicode.IsPrint(rune) {
			return fmt.Errorf("non-printable rune %+q at byte index %d", rune, i)
		}
	}
	return nil
}

// Create creates a status entry in the Spanner Database.
// Must be called with an active RW transaction in the context.
// CreateUser and CreateTime in the passed in status will be ignored
// in favour of the commit time and the currentUser argument.
func Create(status *Status, currentUser string) (*spanner.Mutation, error) {
	if err := Validate(status); err != nil {
		return nil, err
	}

	row := map[string]any{
		"TreeName":      status.TreeName,
		"StatusId":      status.StatusID,
		"GeneralStatus": int64(status.GeneralStatus),
		"Message":       status.Message,
		"CreateUser":    currentUser,
		"CreateTime":    spanner.CommitTimestamp,
	}
	return spanner.InsertOrUpdateMap("Status", row), nil
}

// Read retrieves a status update from the database given the exact time the status update was made.
func Read(ctx context.Context, treeName, statusID string) (*Status, error) {
	row, err := span.ReadRow(ctx, "Status", spanner.Key{treeName, statusID}, []string{"StatusId", "GeneralStatus", "Message", "CreateUser", "CreateTime"})
	if err != nil {
		if spanner.ErrCode(err) == codes.NotFound {
			return nil, NotExistsErr
		}
		return nil, errors.Annotate(err, "get status").Err()
	}
	return fromRow(treeName, row)
}

// ReadLatest retrieves the most recent status update for a tree from the database.
func ReadLatest(ctx context.Context, treeName string) (*Status, error) {
	stmt := spanner.NewStatement(`
		SELECT
			StatusId,
			GeneralStatus,
			Message,
			CreateUser,
			CreateTime
		FROM Status
		WHERE
			TreeName = @treeName
		ORDER BY CreateTime DESC
		LIMIT 1`)
	stmt.Params["treeName"] = treeName
	iter := span.Query(ctx, stmt)
	row, err := iter.Next()
	defer iter.Stop()
	if errors.Is(err, iterator.Done) {
		return nil, NotExistsErr
	} else if err != nil {
		return nil, errors.Annotate(err, "get latest status").Err()
	}
	return fromRow(treeName, row)
}

// ListOptions allows specifying extra options to the List method.
type ListOptions struct {
	// The offset into the list of statuses in the database to start reading at.
	Offset int64
	// The maximum number of items to return from the database.
	// If left as 0, the value of 100 will be used.
	Limit int64
}

// List retrieves a list of status values from the database.  Status values are listed in reverse
// CreateTime order (i.e. most recently created first).
// The options argument may be nil to use default options.
func List(ctx context.Context, treeName string, options *ListOptions) ([]*Status, bool, error) {
	if options == nil {
		options = &ListOptions{}
	}
	if options.Limit == 0 {
		options.Limit = 100
	}

	stmt := spanner.NewStatement(`
		SELECT
			StatusId,
			GeneralStatus,
			Message,
			CreateUser,
			CreateTime
		FROM Status
		WHERE
			TreeName = @treeName
		ORDER BY CreateTime DESC
		LIMIT @limit
		OFFSET @offset`)
	stmt.Params["treeName"] = treeName
	// Read one extra result to detect whether there is a next page.
	stmt.Params["limit"] = options.Limit + 1
	stmt.Params["offset"] = options.Offset

	iter := span.Query(ctx, stmt)

	statusList := []*Status{}
	if err := iter.Do(func(row *spanner.Row) error {
		status, err := fromRow(treeName, row)
		statusList = append(statusList, status)
		return err
	}); err != nil {
		return nil, false, errors.Annotate(err, "list status").Err()
	}
	hasNextPage := false
	if int64(len(statusList)) > options.Limit {
		statusList = statusList[:options.Limit]
		hasNextPage = true
	}
	return statusList, hasNextPage, nil
}

func fromRow(treeName string, row *spanner.Row) (*Status, error) {
	status := &Status{TreeName: treeName}
	generalStatus := int64(0)
	if err := row.Column(0, &status.StatusID); err != nil {
		return nil, errors.Annotate(err, "reading StatusID column").Err()
	}
	if err := row.Column(1, &generalStatus); err != nil {
		return nil, errors.Annotate(err, "reading GeneralStatus column").Err()
	}
	status.GeneralStatus = pb.GeneralState(generalStatus)
	if err := row.Column(2, &status.Message); err != nil {
		return nil, errors.Annotate(err, "reading Message column").Err()
	}
	if err := row.Column(3, &status.CreateUser); err != nil {
		return nil, errors.Annotate(err, "reading CreateUser column").Err()
	}
	if err := row.Column(4, &status.CreateTime); err != nil {
		return nil, errors.Annotate(err, "reading CreateTime column").Err()
	}
	return status, nil
}

// GenerateID returns a random 128-bit status ID, encoded as
// 32 lowercase hexadecimal characters.
func GenerateID() (string, error) {
	randomBytes := make([]byte, 16)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(randomBytes), nil
}