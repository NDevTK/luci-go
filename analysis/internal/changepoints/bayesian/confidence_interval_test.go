// Copyright 2023 The LUCI Authors.
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

package bayesian

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"go.chromium.org/luci/analysis/internal/changepoints"
)

func TestChangePointPositionConfidenceInterval(t *testing.T) {
	a := ChangepointPredictor{
		HasUnexpectedPrior: BetaDistribution{
			Alpha: 0.3,
			Beta:  0.5,
		},
		UnexpectedAfterRetryPrior: BetaDistribution{
			Alpha: 0.5,
			Beta:  0.5,
		},
	}
	Convey("6 commit positions, each with 1 verdict", t, func() {
		var (
			positions     = []int{1, 2, 3, 4, 5, 6}
			total         = []int{2, 2, 1, 1, 2, 2}
			hasUnexpected = []int{0, 0, 0, 1, 2, 2}
		)
		vs := verdicts(positions, total, hasUnexpected)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		So(min, ShouldEqual, 1)
		So(max, ShouldEqual, 4)
	})

	Convey("4 commit positions, 2 verdict each", t, func() {
		var (
			positions     = []int{1, 1, 2, 2, 3, 3, 4, 4}
			total         = []int{2, 2, 2, 2, 2, 2, 2, 2}
			hasUnexpected = []int{0, 0, 0, 0, 1, 1, 1, 1}
		)
		vs := verdicts(positions, total, hasUnexpected)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		So(min, ShouldEqual, 2)
		So(max, ShouldEqual, 6)
	})

	Convey("2 commit position with multiple verdicts each", t, func() {
		var (
			positions     = []int{1, 1, 2, 2, 2, 2}
			total         = []int{3, 3, 1, 2, 3, 3}
			hasUnexpected = []int{0, 0, 0, 2, 3, 3}
		)
		vs := verdicts(positions, total, hasUnexpected)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		// There is only 1 possible position for change point
		So(min, ShouldEqual, 2)
		So(max, ShouldEqual, 2)
	})

	Convey("Pass to flake transition", t, func() {
		var (
			positions     = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}
			total         = []int{2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2}
			hasUnexpected = []int{0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
		)
		vs := verdicts(positions, total, hasUnexpected)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		So(min, ShouldEqual, 1)
		So(max, ShouldEqual, 13)
	})

	Convey("Flake to fail transition", t, func() {
		var (
			positions     = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}
			total         = []int{2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2}
			hasUnexpected = []int{1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2}
		)
		vs := verdicts(positions, total, hasUnexpected)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		So(min, ShouldEqual, 1)
		So(max, ShouldEqual, 13)
	})

	Convey("(Fail, Pass after retry) to (Fail, Fail after retry)", t, func() {
		var (
			positions            = []int{1, 2, 3, 4, 5, 6, 7, 8}
			total                = []int{2, 2, 2, 2, 2, 2, 2, 2}
			hasUnexpected        = []int{2, 2, 2, 2, 2, 2, 2, 2}
			retries              = []int{2, 2, 2, 2, 2, 2, 2, 2}
			unexpectedAfterRetry = []int{0, 0, 0, 0, 2, 2, 2, 2}
		)
		vs := verdictsWithRetries(positions, total, hasUnexpected, retries, unexpectedAfterRetry)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		So(min, ShouldEqual, 2)
		So(max, ShouldEqual, 5)
	})

	Convey("(Fail, Fail after retry) to (Fail, Flaky on retry)", t, func() {
		var (
			positions            = []int{1, 2, 3, 5, 5, 5, 7, 7}
			total                = []int{3, 3, 3, 1, 3, 3, 3, 3}
			hasUnexpected        = []int{3, 3, 3, 1, 3, 3, 3, 3}
			retries              = []int{3, 3, 3, 1, 3, 3, 3, 3}
			unexpectedAfterRetry = []int{3, 3, 3, 1, 0, 0, 1, 1}
		)
		vs := verdictsWithRetries(positions, total, hasUnexpected, retries, unexpectedAfterRetry)
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		So(min, ShouldEqual, 1)
		So(max, ShouldEqual, 3)
	})
}

// Output as of March 2023 on Cloudtop CPU AMD EPYC 7B12
// BenchmarkChangePointPositionConfidenceInterval-24    	    1947	    613173 ns/op
func BenchmarkChangePointPositionConfidenceInterval(b *testing.B) {
	a := ChangepointPredictor{
		ChangepointLikelihood: 0.01,
		HasUnexpectedPrior: BetaDistribution{
			Alpha: 0.3,
			Beta:  0.5,
		},
		UnexpectedAfterRetryPrior: BetaDistribution{
			Alpha: 0.5,
			Beta:  0.5,
		},
	}

	var vs []changepoints.PositionVerdict

	for i := 0; i <= 1000; i++ {
		vs = append(vs, changepoints.PositionVerdict{
			CommitPosition:   i,
			IsSimpleExpected: true,
		})
	}
	for i := 1001; i < 2000; i++ {
		vs = append(vs, changepoints.PositionVerdict{
			CommitPosition:   i,
			IsSimpleExpected: false,
			Details: changepoints.VerdictDetails{
				Runs: []changepoints.Run{
					{
						UnexpectedResultCount: 1,
					},
				},
			},
		})
	}

	for i := 0; i < b.N; i++ {
		min, max := a.ChangepointPositionConfidenceInterval(vs, 0.005)
		if min > 1001 || max < 1001 {
			panic("Invalid result")
		}
	}
}