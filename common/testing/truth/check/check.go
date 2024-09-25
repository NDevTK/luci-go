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

package check

import (
	"testing"

	"go.chromium.org/luci/common/testing/truth"
	"go.chromium.org/luci/common/testing/truth/comparison"
	"go.chromium.org/luci/common/testing/truth/should"
)

// That will compare `actual` using `compare(actual)`.
//
// If this results in a failure.Summary, it will be reported with truth.Report,
// and the test will be failed with t.Fail().
//
// Example: `check.That(t, 10, should.Equal(20))`
//
// Returns `true` iff `compare(actual)` returned no failure (i.e. nil)
func That[T any](t truth.TestingTB, actual T, compare comparison.Func[T], opts ...truth.Option) (ok bool) {
	summary := truth.ApplyAllOptions(compare(actual), opts)
	if summary == nil {
		return true
	}

	t.Helper()
	truth.Report(t, "check.That", summary)
	t.Fail()
	return false
}

// Loosely will compare `actual` using `compare.CastCompare(actual)`.
//
// If this results in a failure.Summary, it will be reported with truth.Report,
// and the test will be failed with t.Fail().
//
// Example: `check.Loosely(t, 10, should.Equal(20))`
//
// Returns `true` iff `compare.CastCompare(actual)` returned no failure (i.e. nil)
func Loosely[T any](t truth.TestingTB, actual any, compare comparison.Func[T], opts ...truth.Option) (ok bool) {
	summary := truth.ApplyAllOptions(compare.CastCompare(actual), opts)
	if summary == nil {
		return true
	}

	t.Helper()
	truth.Report(t, "check.Loosely", summary)
	t.Fail()
	return false
}

// NoErr is a short helper to check that a given `err` is nil.
//
// This is identical to:
//
//	check.That(t, err, should.ErrLike(nil))
//
// See [should.ErrLike].
func NoErr(t testing.TB, err error) bool {
	if err != nil {
		t.Helper()
		return /*check*/ That(t, err, should.ErrLike(nil))
	}
	return true
}

// ErrIsLike is a short helper to check that a given `err` matches a string or
// error `target`.
//
// This is identical to:
//
//	check.That(t, err, should.ErrLike(target))
//
// See [should.ErrLike].
func ErrIsLike(t testing.TB, err error, target any) bool {
	t.Helper()
	return /*check*/ That(t, err, should.ErrLike(target))
}
