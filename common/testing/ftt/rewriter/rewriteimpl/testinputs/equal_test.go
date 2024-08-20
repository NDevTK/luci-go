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

package testinputs

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestEqual(t *testing.T) {
	t.Parallel()

	Convey("something", t, func() {
		So(0, ShouldEqual, 0)
		So(100, ShouldEqual, 100)

		So("", ShouldEqual, "")

		So(nil, ShouldEqual, nil)

		So("nerb", ShouldEqual, "nerb")

		So([]int{1, 2}, ShouldEqual, []int{1, 2})
		So(map[int]int{1: 2}, ShouldEqual, map[int]int{1: 2})
	})
}
