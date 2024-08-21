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

package artifacts

import (
	"regexp"
	"testing"

	resultpb "go.chromium.org/luci/resultdb/proto/v1"

	. "github.com/smartystreets/goconvey/convey"
)

func TestMatchWithContextRegexBuilder(t *testing.T) {
	t.Parallel()

	Convey(`MatchWithContextRegexBuilder`, t, func() {
		// Matching part in the middle of a line.
		text1 := "line1\r\nline2\r\nline3exact.contain()line3after\r\nline4"
		// Matching part at the end of a line.
		text2 := "line1exact.contain()\r\nline2\r\nline3\r\nline4"
		// Matching part at the end of the text.
		text3 := "line1\r\nline2\r\nline3\r\nline4exact.contain()"
		verifyRegex := func(text string, regex string, expected string) {
			r, err := regexp.Compile(regex)
			So(err, ShouldBeNil)
			matches := r.FindStringSubmatch(text)
			So(matches, ShouldHaveLength, 2)
			So(matches[1], ShouldEqual, expected)
		}
		Convey(`exact contain mode`, func() {
			builder := newMatchWithContextRegexBuilder(&resultpb.ArtifactContentMatcher{
				Matcher: &resultpb.ArtifactContentMatcher_Contain{
					Contain: "exact.contain()",
				},
			})

			Convey(`capture match`, func() {
				resp := builder.withCaptureMatch(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?((?i)exact\\.contain\\(\\))[^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, "exact.contain()")
				verifyRegex(text2, resp, "exact.contain()")
				verifyRegex(text3, resp, "exact.contain()")
			})

			Convey(`capture before`, func() {
				resp := builder.withCaptureContextBefore(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?([^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?)(?i)exact\\.contain\\(\\)[^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, "line2\r\nline3")
				verifyRegex(text2, resp, "line1")
				verifyRegex(text3, resp, "line3\r\nline4")
			})

			Convey(`capture after`, func() {
				resp := builder.withCaptureContextAfter(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(?i)exact\\.contain\\(\\)([^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*)(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, "line3after\r\nline4")
				verifyRegex(text2, resp, "\r\nline2")
				verifyRegex(text3, resp, "")
			})

			Convey(`should be case insensitive`, func() {
				builder := newMatchWithContextRegexBuilder(&resultpb.ArtifactContentMatcher{
					Matcher: &resultpb.ArtifactContentMatcher_Contain{
						Contain: "EXACT.contain()",
					},
				})

				resp := builder.withCaptureMatch(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?((?i)EXACT\\.contain\\(\\))[^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, "exact.contain()")
				verifyRegex(text2, resp, "exact.contain()")
				verifyRegex(text3, resp, "exact.contain()")
			})
		})

		Convey(`regex contain mode`, func() {
			builder := newMatchWithContextRegexBuilder(&resultpb.ArtifactContentMatcher{
				Matcher: &resultpb.ArtifactContentMatcher_RegexContain{
					RegexContain: `\..*\(\)`,
				},
			})

			Convey(`capture match`, func() {
				resp := builder.withCaptureMatch(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(\\..*\\(\\))[^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, ".contain()")
				verifyRegex(text2, resp, ".contain()")
				verifyRegex(text3, resp, ".contain()")
			})

			Convey(`capture before`, func() {
				resp := builder.withCaptureContextBefore(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?([^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?)\\..*\\(\\)[^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, "line2\r\nline3exact")
				verifyRegex(text2, resp, "line1exact")
				verifyRegex(text3, resp, "line3\r\nline4exact")
			})

			Convey(`capture after`, func() {
				resp := builder.withCaptureContextAfter(true).build()
				So(resp, ShouldEqual, "(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?(?:\\r\\n|\\r|\\n)?[^\\r\\n]*?\\..*\\(\\)([^\\r\\n]*(?:\\r\\n|\\r|\\n)?[^\\r\\n]*)(?:\\r\\n|\\r|\\n)?")
				verifyRegex(text1, resp, "line3after\r\nline4")
				verifyRegex(text2, resp, "\r\nline2")
				verifyRegex(text3, resp, "")
			})
		})

		Convey(`should match first occurrence`, func() {
			builder := newMatchWithContextRegexBuilder(&resultpb.ArtifactContentMatcher{
				Matcher: &resultpb.ArtifactContentMatcher_Contain{
					Contain: "l",
				},
			})

			resp := builder.withCaptureMatch(true).withCaptureContextBefore(true).withCaptureContextAfter(true).build()
			r, err := regexp.Compile(resp)
			So(err, ShouldBeNil)
			matches := r.FindStringSubmatch(text1)
			So(matches, ShouldHaveLength, 4)
			So(matches[1], ShouldEqual, "")
			So(matches[2], ShouldEqual, "l")
			So(matches[3], ShouldEqual, "ine1\r\nline2")
		})
	})
}
