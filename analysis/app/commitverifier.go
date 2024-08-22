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

package app

import (
	"context"
	"encoding/json"
	"net/http"

	"google.golang.org/protobuf/encoding/protojson"

	"go.chromium.org/luci/common/errors"
	"go.chromium.org/luci/common/tsmon/field"
	"go.chromium.org/luci/common/tsmon/metric"
	cvv1 "go.chromium.org/luci/cv/api/v1"
	"go.chromium.org/luci/server/pubsub"
	"go.chromium.org/luci/server/router"

	"go.chromium.org/luci/analysis/internal/ingestion/join"
)

var (
	cvRunCounter = metric.NewCounter(
		"analysis/ingestion/pubsub/cv_runs",
		"The number of CV runs received by LUCI Analysis from PubSub.",
		nil,
		// The LUCI Project.
		field.String("project"),
		// "success", "transient-failure", "permanent-failure" or "ignored".
		field.String("status"))
)

type handleCVRunMethod func(ctx context.Context, psRun *cvv1.PubSubRun) (project string, processed bool, err error)

// CVRunHandler accepts and processes CV Run Pub/Sub messages.
type CVRunHandler struct {
	// The method to use to handle the deserialized CV Run pub/sub message.
	// Used to allow the handler to be replaced for testing.
	handleCVRun handleCVRunMethod
}

// NewCVRunHandler initialises a new CVRunHandler.
func NewCVRunHandler() *CVRunHandler {
	return &CVRunHandler{
		handleCVRun: join.JoinCVRun,
	}
}

func (h *CVRunHandler) Handle(ctx context.Context, message pubsub.Message, cvMessage *cvv1.PubSubRun) error {
	status := "unknown"
	project := "unknown"
	defer func() {
		// Closure for late binding.
		cvRunCounter.Add(ctx, 1, project, status)
	}()

	var err error
	project, processed, err := h.handleCVRun(ctx, cvMessage)
	if err == nil && !processed {
		err = pubsub.Ignore.Apply(errors.Reason("ignoring CV run").Err())
	}
	status = errStatus(err)
	return err
}

// HandleLegacy processes a CV Pub/Sub message.
func (h *CVRunHandler) HandleLegacy(ctx *router.Context) {
	status := "unknown"
	project := "unknown"
	defer func() {
		// Closure for late binding.
		cvRunCounter.Add(ctx.Request.Context(), 1, project, status)
	}()
	project, processed, err := h.handlerImplLegacy(ctx.Request.Context(), ctx.Request)

	switch {
	case err != nil:
		errors.Log(ctx.Request.Context(), errors.Annotate(err, "handling cv pubsub event").Err())
		status = processErr(ctx, err)
		return
	case !processed:
		status = "ignored"
		// Use subtly different "success" response codes to surface in
		// standard GAE logs whether an ingestion was ignored or not,
		// while still acknowledging the pub/sub.
		// See https://cloud.google.com/pubsub/docs/push#receiving_messages.
		ctx.Writer.WriteHeader(http.StatusNoContent) // 204
	default:
		status = "success"
		ctx.Writer.WriteHeader(http.StatusOK)
	}
}

func (h *CVRunHandler) handlerImplLegacy(ctx context.Context, request *http.Request) (project string, processed bool, err error) {
	psRun, err := extractPubSubRunLegacy(request)
	if err != nil {
		return "unknown", false, errors.Annotate(err, "failed to extract run").Err()
	}
	return h.handleCVRun(ctx, psRun)
}

func extractPubSubRunLegacy(r *http.Request) (*cvv1.PubSubRun, error) {
	var msg pubsubMessage
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		return nil, errors.Annotate(err, "could not decode cv pubsub message").Err()
	}

	var run cvv1.PubSubRun
	unmarshalOpts := protojson.UnmarshalOptions{DiscardUnknown: true}
	err := unmarshalOpts.Unmarshal(msg.Message.Data, &run)
	if err != nil {
		return nil, errors.Annotate(err, "could not parse cv pubsub message data").Err()
	}
	return &run, nil
}
