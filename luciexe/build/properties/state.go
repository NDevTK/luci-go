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

package properties

import (
	"context"
	"sync/atomic"

	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/structpb"

	"go.chromium.org/luci/common/errors"
)

// State holds initial and current states for all the namespaces in a given
// Registry.
//
// There can be multiple State objects for the same Registry, and all
// RegisteredProperty objects from that Registry will work with any State from
// that Registry.
//
// Each State maintains it's own `version` (observable via InstOptNotify and
// State.Serialize). Any set/modify operation to any property namespace
// (including the top level namespace) in this State will increment the version
// by 1.
//
// IN PRACTICE, most programs will only use the State embedded in the
// context.Context. This is set by go.chromium.org/luci/luciexe/bulid.Main or
// go.chromium.org/luci/luciexe/bulid.Start. However, direct Instantiation of
// the go.chromium.org/luci/luciexe/bulid.Properties Registry to get a new State
// for tests is likely going to be useful, which is why this is a public API
// separate from the build library itself.
type State struct {
	registry *Registry
	version  atomic.Int64

	// initialData values hold either a *struct or a map
	initialData map[string]any
	outputState map[string]*outputPropertyState

	notifyFunc func(version int64)
}

var ctxKey = "holds a *State"

// SetInContext installs the State into context, returning an error if `ctx` already
// includes a State.
func (s *State) SetInContext(ctx context.Context) (context.Context, error) {
	if s == nil {
		return ctx, nil
	}

	cur := GetState(ctx)
	if cur != nil {
		return ctx, errors.New("properties.SetState: context already has State.")
	}

	return context.WithValue(ctx, &ctxKey, s), nil
}

// GetState retrieves the State from the context.
//
// If no State is in the context, returns `nil`.
func GetState(ctx context.Context) *State {
	ret, _ := ctx.Value(&ctxKey).(*State)
	return ret
}

// Serialize serializes the entire State to a single NEW Struct proto message.
//
// This also returns a version number which is <= to the actual version number
// of the returned Struct. You can safely compare this version number to the one
// emitted by `notify` to discard notify events which are less than or equal to
// this number.
//
// The returned Struct is fully cloned and can be read or written as you need.
//
// Namespaces with no data (i.e. would be an empty JSON object `{}`) are
// omitted. This includes the top-level document (so - if no values are present
// in the overall document at all, this returns nil).
//
// The ONLY way this will return an error is if the top-level namespace is
// either *Struct or a map type, AND the top-level namespace contains a key
// which overlaps with one of the other output property namespaces.
//
// This function is non-blocking - it will return the version of the State
// observed at the beginning of Serialize (startVers), and it will return
// (consistent==true) if the version observed after the construction of `ret` is
// the same as startVers. If consistent is false, you can choose to continue
// with the possibly inconsistent `ret`, and just call Serialize again later, or
// you can discard `ret` and try again.
//
// There is NO synchronization other than bumping the version number up between
// different properties in this state - multiple goroutines can mutate
// RegisteredPropertyOuts simultaneously. Manipulation of a single
// RegisteredPropertyOut is fully synchronized, however.
//
// To get this into JSON form, just use protojson.Marshal.
func (s *State) Serialize() (ret *structpb.Struct, startVers int64, consistent bool, err error) {
	// Load the version - if any mutations happen between now and when we finish
	// Serialize, it's possible that the caller will have to call Serialize again.
	//
	// However, this allows us to make all property updates independent of each
	// other, and Serialize be non-blocking.
	startVers = s.version.Load()

	if pstate := s.outputState[""]; pstate != nil {
		ret = proto.Clone(pstate.toStruct()).(*structpb.Struct)
	} else {
		ret = &structpb.Struct{}
	}
	if ret.Fields == nil {
		ret.Fields = make(map[string]*structpb.Value, len(s.outputState))
	}

	for ns, pstate := range s.outputState {
		if ns == "" {
			continue
		}
		if _, ok := ret.Fields[ns]; ok {
			err = errors.Reason(
				"properties.State.Serialize: top-level namespace property %q overlaps with registered namespace.", ns).Err()
			return
		}

		st := pstate.toStruct()
		if len(st.GetFields()) == 0 {
			continue
		}
		ret.Fields[ns] = structpb.NewStructValue(proto.Clone(st).(*structpb.Struct))
	}
	if len(ret.Fields) == 0 {
		ret = nil
	}
	consistent = s.version.Load() == startVers
	return
}