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

package should

import (
	"go.chromium.org/luci/common/testing/truth/comparison"
	"go.chromium.org/luci/common/testing/truth/failure"
)

// BeNaN checks that `actual` is a floating point NaN.
func BeNaN[T ~float32 | ~float64](actual T) *failure.Summary {
	if actual != actual { // see `math.IsNaN` for why this works.
		return nil
	}
	return comparison.NewSummaryBuilder("should.BeNaN", actual).Actual(actual).Summary
}

// NotBeNaN checks that `actual` is a floating point NaN.
func NotBeNaN[T ~float32 | ~float64](actual T) *failure.Summary {
	if actual == actual { // see `math.IsNaN` for why this works.
		return nil
	}
	return comparison.NewSummaryBuilder("should.NotBeNaN", actual).Actual(actual).Summary
}
