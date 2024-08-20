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

package testoutputs

import (
	"go.chromium.org/luci/common/testing/ftt"
	"go.chromium.org/luci/common/testing/truth/assert"
	"go.chromium.org/luci/common/testing/truth/should"
	"testing"
)

func TestEqual(t *testing.T) {
	t.Parallel()

	ftt.Run("something", t, func(t *ftt.Test) {
		assert.Loosely(t, 0, should.BeZero)
		assert.Loosely(t, 100, should.Equal(100))

		assert.Loosely(t, "", should.BeEmpty)

		assert.Loosely(t, nil, should.BeNil)

		assert.Loosely(t, "nerb", should.Equal("nerb"))

		assert.Loosely(t, []int{1, 2}, should.Resemble([]int{1, 2}))
		assert.Loosely(t, map[int]int{1: 2}, should.Resemble(map[int]int{1: 2}))
	})
}
