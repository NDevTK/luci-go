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

package buganizer

import (
	"context"
	"strconv"
	"strings"
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
	"google.golang.org/protobuf/types/known/timestamppb"

	"go.chromium.org/luci/analysis/internal/bugs"
	configpb "go.chromium.org/luci/analysis/proto/config"
	"go.chromium.org/luci/common/clock"
	"go.chromium.org/luci/common/clock/testclock"
	. "go.chromium.org/luci/common/testing/assertions"
	"go.chromium.org/luci/third_party/google.golang.org/genproto/googleapis/devtools/issuetracker/v1"
)

func TestBugManagerLegacy(t *testing.T) {
	t.Parallel()

	Convey("With Bug Manager", t, func() {
		ctx := context.Background()
		fakeClient := NewFakeClient()
		fakeStore := fakeClient.FakeStore
		buganizerCfg := ChromeOSTestConfig()

		bugFilingThreshold := bugs.TestBugFilingThresholds()

		projectCfg := &configpb.ProjectConfig{
			Buganizer:           buganizerCfg,
			BugFilingThresholds: bugFilingThreshold,
			BugSystem:           configpb.BugSystem_BUGANIZER,
			BugManagement: &configpb.BugManagement{
				Policies: []*configpb.BugManagementPolicy{},
			},
		}

		bm := NewBugManager(fakeClient, "https://luci-analysis-test.appspot.com", "chromeos", "email@test.com", projectCfg, false)
		now := time.Date(2044, time.April, 4, 4, 4, 4, 4, time.UTC)
		ctx, tc := testclock.UseTime(ctx, now)

		Convey("Create - Legacy", func() {
			createRequest := newCreateRequest()
			createRequest.Metrics = bugs.LowP1Impact()
			expectedIssue := &issuetracker.Issue{
				IssueId: 1,
				IssueState: &issuetracker.IssueState{
					ComponentId: buganizerCfg.DefaultComponent.Id,
					Type:        issuetracker.Issue_BUG,
					Status:      issuetracker.Issue_NEW,
					Severity:    issuetracker.Issue_S2,
					Priority:    issuetracker.Issue_P1,
					Title:       "Tests are failing: Expected equality of these values: \"Expected_Value\" my_expr.evaluate(123) Which is: \"Unexpected_Value\"",
				},
				CreatedTime:  timestamppb.New(clock.Now(ctx)),
				ModifiedTime: timestamppb.New(clock.Now(ctx)),
			}

			Convey("With reason-based failure cluster", func() {
				reason := `Expected equality of these values:
					"Expected_Value"
					my_expr.evaluate(123)
						Which is: "Unexpected_Value"`
				createRequest.Description.Title = reason
				createRequest.Description.Description = "A cluster of failures has been found with reason: " + reason

				expectedIssue.Description = &issuetracker.IssueComment{
					CommentNumber: 1,
					Comment: "A cluster of failures has been found with reason: Expected equality " +
						"of these values:\n\t\t\t\t\t\"Expected_Value\"\n\t\t\t\t\tmy_expr.evaluate(123)\n\t\t\t\t\t\t" +
						"Which is: \"Unexpected_Value\"\n" +
						"\n" +
						"See failure impact and configure the failure association rule for this bug at: https://luci-analysis-test.appspot.com/b/1\n" +
						"\n" +
						"The priority was set to P1 because:\n" +
						"- Test Results Failed (1-day) >= 500\n" +
						"\n" +
						"This bug has been automatically filed by LUCI Analysis in response to a cluster of test failures.\n" +
						"\n" +
						"How to action this bug: https://luci-analysis-test.appspot.com/help#new-bug-filed\n" +
						"Provide feedback: https://luci-analysis-test.appspot.com/help#feedback\n" +
						"Was this bug filed in the wrong component? See: https://luci-analysis-test.appspot.com/help#component-selection",
				}

				Convey("Happy path", func() {
					bugID, err := bm.Create(ctx, createRequest)
					So(err, ShouldBeNil)
					So(bugID, ShouldEqual, "1")
					So(len(fakeStore.Issues), ShouldEqual, 1)

					issueData := fakeStore.Issues[1]
					So(issueData.Issue, ShouldResembleProto, expectedIssue)
					So(len(issueData.Comments), ShouldEqual, 1)
					// Link to cluster page should appear in output.
					So(issueData.Comments[0].Comment, ShouldContainSubstring, "https://luci-analysis-test.appspot.com/b/1")
				})
				Convey("Failed to update issue comment", func() {
					fakeClient.ShouldFailIssueCommentUpdates = true
					bugID, err := bm.Create(ctx, createRequest)
					So(err, ShouldBeNil)
					So(bugID, ShouldEqual, "1")
					So(len(fakeStore.Issues), ShouldEqual, 1)

					expectedIssue.Description.Comment = strings.ReplaceAll(expectedIssue.Description.Comment,
						"https://luci-analysis-test.appspot.com/b/1",
						"https://luci-analysis-test.appspot.com/p/chromeos/rules/new-rule-id")

					issueData := fakeStore.Issues[1]
					So(issueData.Issue, ShouldResembleProto, expectedIssue)
					So(len(issueData.Comments), ShouldEqual, 1)
					So(issueData.Comments[0].Comment, ShouldNotContainSubstring, "https://luci-analysis-test.appspot.com/b/1")
				})
			})
			Convey("With test name failure cluster", func() {
				createRequest.Description.Title = "ninja://:blink_web_tests/media/my-suite/my-test.html"
				createRequest.Description.Description = "A test is failing " + createRequest.Description.Title
				expectedIssue.Description = &issuetracker.IssueComment{
					CommentNumber: 1,
					Comment: "A test is failing ninja://:blink_web_tests/media/my-suite/my-test.html\n" +
						"\n" +
						"See failure impact and configure the failure association rule for this bug at: https://luci-analysis-test.appspot.com/b/1\n" +
						"\n" +
						"The priority was set to P1 because:\n" +
						"- Test Results Failed (1-day) >= 500\n" +
						"\n" +
						"This bug has been automatically filed by LUCI Analysis in response to a cluster of test failures.\n" +
						"\n" +
						"How to action this bug: https://luci-analysis-test.appspot.com/help#new-bug-filed\n" +
						"Provide feedback: https://luci-analysis-test.appspot.com/help#feedback\n" +
						"Was this bug filed in the wrong component? See: https://luci-analysis-test.appspot.com/help#component-selection",
				}
				expectedIssue.IssueState.Title = "Tests are failing: ninja://:blink_web_tests/media/my-suite/my-test.html"

				bugID, err := bm.Create(ctx, createRequest)
				So(err, ShouldBeNil)
				So(bugID, ShouldEqual, "1")
				So(len(fakeStore.Issues), ShouldEqual, 1)
				issue := fakeStore.Issues[1]

				So(issue.Issue, ShouldResembleProto, expectedIssue)
				So(len(issue.Comments), ShouldEqual, 1)
				So(issue.Comments[0].Comment, ShouldContainSubstring, "https://luci-analysis-test.appspot.com/b/1")
			})

			Convey("Does nothing if in simulation mode", func() {
				bm.Simulate = true
				_, err := bm.Create(ctx, createRequest)
				So(err, ShouldEqual, bugs.ErrCreateSimulated)
				So(len(fakeStore.Issues), ShouldEqual, 0)
			})

			Convey("With provided component id", func() {
				createRequest.BuganizerComponent = 7890
				bugID, err := bm.Create(ctx, createRequest)
				So(err, ShouldBeNil)
				So(bugID, ShouldEqual, "1")
				So(len(fakeStore.Issues), ShouldEqual, 1)
				issue := fakeStore.Issues[1]
				So(issue.Issue.IssueState.ComponentId, ShouldEqual, 7890)
			})

			Convey("With provided component id without permission", func() {
				createRequest.BuganizerComponent = ComponentWithNoAccess
				// TODO: Mock permission call to fail.
				bugID, err := bm.Create(ctx, createRequest)
				So(err, ShouldBeNil)
				So(bugID, ShouldEqual, "1")
				So(len(fakeStore.Issues), ShouldEqual, 1)
				issue := fakeStore.Issues[1]
				// Should have fallback component ID because no permission to wanted component.
				So(issue.Issue.IssueState.ComponentId, ShouldEqual, buganizerCfg.DefaultComponent.Id)
				// No permission to component should appear in comments.
				So(len(issue.Comments), ShouldEqual, 2)
				So(issue.Comments[1].Comment, ShouldContainSubstring, strconv.Itoa(ComponentWithNoAccess))
			})

			Convey("With Buganizer test mode", func() {
				createRequest.BuganizerComponent = 1234
				// TODO: Mock permission call to fail.
				ctx = context.WithValue(ctx, &BuganizerTestModeKey, true)
				bugID, err := bm.Create(ctx, createRequest)
				So(err, ShouldBeNil)
				So(bugID, ShouldEqual, "1")
				So(len(fakeStore.Issues), ShouldEqual, 1)
				issue := fakeStore.Issues[1]
				// Should have fallback component ID because no permission to wanted component.
				So(issue.Issue.IssueState.ComponentId, ShouldEqual, buganizerCfg.DefaultComponent.Id)
			})
		})
		Convey("Update - Legacy", func() {
			c := newCreateRequest()
			c.Metrics = bugs.P2Impact()
			bugID, err := bm.Create(ctx, c)
			So(err, ShouldBeNil)
			So(bugID, ShouldEqual, "1")
			So(len(fakeStore.Issues), ShouldEqual, 1)
			So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P2)
			bugsToUpdate := []bugs.BugUpdateRequest{
				{
					Bug:                              bugs.BugID{System: bugs.BuganizerSystem, ID: bugID},
					Metrics:                          c.Metrics,
					IsManagingBug:                    true,
					RuleID:                           "123",
					IsManagingBugPriority:            true,
					IsManagingBugPriorityLastUpdated: clock.Now(ctx),
				},
			}
			expectedResponse := []bugs.BugUpdateResponse{
				{IsDuplicate: false},
			}
			updateDoesNothing := func() {
				oldTime := timestamppb.New(fakeStore.Issues[1].Issue.ModifiedTime.AsTime())
				response, err := bm.Update(ctx, bugsToUpdate)
				So(err, ShouldBeNil)
				So(response, ShouldResemble, expectedResponse)
				So(fakeStore.Issues[1].Issue.ModifiedTime, ShouldResemble, oldTime)
			}

			Convey("If less than expected issues are returned, should not fail", func() {
				fakeStore.Issues = map[int64]*IssueData{}
				bugsToUpdate := []bugs.BugUpdateRequest{
					{
						Bug:                              bugs.BugID{System: bugs.BuganizerSystem, ID: bugID},
						Metrics:                          c.Metrics,
						RuleID:                           "123",
						IsManagingBug:                    true,
						IsManagingBugPriority:            true,
						IsManagingBugPriorityLastUpdated: clock.Now(ctx),
					},
				}
				expectedResponse = []bugs.BugUpdateResponse{
					{
						IsDuplicate:   false,
						ShouldArchive: false,
					},
				}
				response, err := bm.Update(ctx, bugsToUpdate)
				So(err, ShouldBeNil)
				So(response, ShouldResemble, expectedResponse)

			})

			Convey("If impact unchanged, does nothing", func() {
				updateDoesNothing()
			})
			Convey("If impact changed", func() {
				bugsToUpdate[0].Metrics = bugs.P3Impact()
				Convey("Does not reduce priority if impact within hysteresis range", func() {
					bugsToUpdate[0].Metrics = bugs.HighP3Impact()

					updateDoesNothing()
				})
				Convey("Does not update bug if IsManagingBug false", func() {
					bugsToUpdate[0].Metrics = bugs.ClosureImpact()
					bugsToUpdate[0].IsManagingBug = false

					updateDoesNothing()
				})
				Convey("Does not update bug if Impact unset", func() {
					// Simulate valid impact not being available, e.g. due
					// to ongoing reclustering.
					bugsToUpdate[0].Metrics = nil

					updateDoesNothing()
				})
				Convey("Reduces priority in response to reduced impact", func() {
					bugsToUpdate[0].Metrics = bugs.P3Impact()
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P3)

					So(fakeStore.Issues[1].Comments, ShouldHaveLength, 2)
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"Because:\n"+
							"- Test Runs Failed (1-day) < 9, and\n"+
							"- Test Results Failed (1-day) < 90\n"+
							"LUCI Analysis has decreased the bug priority from P2 to P3.")
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/help#priority-update")
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/b/1")
					// Verify repeated update has no effect.
					updateDoesNothing()
				})
				Convey("Does not increase priority if impact within hysteresis range", func() {
					bugsToUpdate[0].Metrics = bugs.LowP1Impact()

					updateDoesNothing()
				})
				Convey("Increases priority in response to increased impact (single-step)", func() {
					bugsToUpdate[0].Metrics = bugs.P1Impact()
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P1)

					So(fakeStore.Issues[1].Comments, ShouldHaveLength, 2)
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"Because:\n"+
							"- Test Results Failed (1-day) >= 550\n"+
							"LUCI Analysis has increased the bug priority from P2 to P1.")
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/help#priority-update")
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/b/1")

					// Verify repeated update has no effect.
					updateDoesNothing()
				})
				Convey("Increases priority in response to increased impact (multi-step)", func() {
					ctx = context.WithValue(ctx, &BuganizerSelfEmailKey, "email@test.com")
					bugsToUpdate[0].Metrics = bugs.P0Impact()

					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P0)

					expectedComment := "Because:\n" +
						"- Test Results Failed (1-day) >= 1000\n" +
						"LUCI Analysis has increased the bug priority from P2 to P0."
					So(fakeStore.Issues[1].Comments, ShouldHaveLength, 2)
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring, expectedComment)
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/help#priority-update")
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/b/1")

					// Verify repeated update has no effect.
					updateDoesNothing()
				})
				Convey("Does not adjust priority if priority manually set", func() {
					ctx := context.WithValue(ctx, &BuganizerSelfEmailKey, "luci-analysis@prod.google.com")
					fakeStore.Issues[1].Issue.IssueState.Priority = issuetracker.Issue_P1
					fakeStore.Issues[1].IssueUpdates = append(fakeStore.Issues[1].IssueUpdates, &issuetracker.IssueUpdate{
						Author: &issuetracker.User{
							EmailAddress: "testuser@google.com",
						},
						Timestamp: timestamppb.New(clock.Now(ctx).Add(time.Minute * 4)),
						FieldUpdates: []*issuetracker.FieldUpdate{
							{
								Field: "priority",
							},
						},
					})
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P1)
					expectedResponse[0].DisableRulePriorityUpdates = true
					So(response[0].DisableRulePriorityUpdates, ShouldBeTrue)

					// Check repeated update does nothing more.
					initialComments := len(fakeStore.Issues[1].Comments)
					expectedResponse[0].DisableRulePriorityUpdates = false
					bugsToUpdate[0].IsManagingBugPriority = false
					updateDoesNothing()
					So(len(fakeStore.Issues[1].Comments), ShouldEqual, initialComments)

					Convey("Unless IsManagingBugPriority manually updated", func() {
						bugsToUpdate[0].IsManagingBugPriority = true
						bugsToUpdate[0].IsManagingBugPriorityLastUpdated = clock.Now(ctx).Add(time.Minute * 15)
						expectedResponse[0].DisableRulePriorityUpdates = false
						response, err := bm.Update(ctx, bugsToUpdate)
						So(response, ShouldResemble, expectedResponse)
						So(err, ShouldBeNil)
						So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P3)
						// Verify repeated update has no effect.
						updateDoesNothing()
					})
				})
				Convey("Does nothing if in simulation mode", func() {
					bm.Simulate = true
					updateDoesNothing()
				})
			})
			Convey("If impact falls below lowest priority threshold", func() {
				bugsToUpdate[0].Metrics = bugs.ClosureImpact()
				Convey("Update leaves bug open if impact within hysteresis range", func() {
					bugsToUpdate[0].Metrics = bugs.P3LowestBeforeClosureImpact()
					// Update may reduce the priority from P2 to P3, but the
					// issue should be left open. This is because hysteresis on
					// priority and issue verified state is applied separately.
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.IssueState.Status, ShouldEqual, issuetracker.Issue_NEW)
				})

				Convey("Sets verifier and assignee to luci analysis if assignee is nil", func() {
					fakeStore.Issues[1].Issue.IssueState.Assignee = nil
					ctx = context.WithValue(ctx, &BuganizerSelfEmailKey, "email@test.com")
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.IssueState.Status, ShouldEqual, issuetracker.Issue_VERIFIED)
					So(fakeStore.Issues[1].Issue.IssueState.Verifier.EmailAddress, ShouldEqual, "email@test.com")
					So(fakeStore.Issues[1].Issue.IssueState.Assignee.EmailAddress, ShouldEqual, "email@test.com")
				})

				Convey("Update closes bug", func() {
					fakeStore.Issues[1].Issue.IssueState.Assignee = &issuetracker.User{
						EmailAddress: "user@google.com",
					}

					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.IssueState.Status, ShouldEqual, issuetracker.Issue_VERIFIED)

					expectedComment := "Because:\n" +
						"- Test Results Failed (1-day) < 45, and\n" +
						"- Test Results Failed (3-day) < 272, and\n" +
						"- Test Results Failed (7-day) < 1\n" +
						"LUCI Analysis is marking the issue verified."
					So(fakeStore.Issues[1].Comments, ShouldHaveLength, 2)
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring, expectedComment)
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/help#bug-verified")
					So(fakeStore.Issues[1].Comments[1].Comment, ShouldContainSubstring,
						"https://luci-analysis-test.appspot.com/b/1")
					// Verify repeated update has no effect.
					updateDoesNothing()

					Convey("Does not reopen bug if impact within hysteresis range", func() {
						bugsToUpdate[0].Metrics = bugs.HighestNotFiledImpact()

						updateDoesNothing()
					})

					Convey("Rules for verified bugs archived after 30 days", func() {
						tc.Add(time.Hour * 24 * 30)

						expectedResponse := []bugs.BugUpdateResponse{
							{
								ShouldArchive: true,
							},
						}
						tc.Add(time.Minute * 2)
						response, err := bm.Update(ctx, bugsToUpdate)
						So(err, ShouldBeNil)
						So(response, ShouldResemble, expectedResponse)
						So(fakeStore.Issues[1].Issue.ModifiedTime, ShouldResembleProto, timestamppb.New(now))
					})

					Convey("If impact increases, bug is re-opened with correct priority", func() {
						bugsToUpdate[0].Metrics = bugs.P3Impact()
						Convey("Issue has owner", func() {
							// Update issue owner.
							fakeStore.Issues[1].Issue.IssueState.Assignee = &issuetracker.User{
								EmailAddress: "testuser@google.com",
							}

							// Issue should return to "Assigned" status.
							response, err := bm.Update(ctx, bugsToUpdate)
							So(err, ShouldBeNil)
							So(response, ShouldResemble, expectedResponse)
							So(fakeStore.Issues[1].Issue.IssueState.Status, ShouldEqual, issuetracker.Issue_ASSIGNED)
							So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P3)

							expectedComment := "Because:\n" +
								"- Test Results Failed (1-day) >= 75\n" +
								"LUCI Analysis has re-opened the bug.\n\n" +
								"Because:\n" +
								"- Test Runs Failed (1-day) < 9, and\n" +
								"- Test Results Failed (1-day) < 90\n" +
								"LUCI Analysis has decreased the bug priority from P2 to P3."
							So(fakeStore.Issues[1].Comments, ShouldHaveLength, 3)
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring, expectedComment)
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring,
								"https://luci-analysis-test.appspot.com/help#bug-reopened")
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring,
								"https://luci-analysis-test.appspot.com/b/1")

							// Verify repeated update has no effect.
							updateDoesNothing()
						})
						Convey("Issue has no assignee", func() {
							// Remove owner.
							fakeStore.Issues[1].Issue.IssueState.Assignee = nil

							// Issue should return to "Untriaged" status.
							response, err := bm.Update(ctx, bugsToUpdate)
							So(err, ShouldBeNil)
							So(response, ShouldResemble, expectedResponse)
							So(fakeStore.Issues[1].Issue.IssueState.Status, ShouldEqual, issuetracker.Issue_ACCEPTED)
							So(fakeStore.Issues[1].Issue.IssueState.Priority, ShouldEqual, issuetracker.Issue_P3)

							expectedComment := "Because:\n" +
								"- Test Results Failed (1-day) >= 75\n" +
								"LUCI Analysis has re-opened the bug.\n\n" +
								"Because:\n" +
								"- Test Runs Failed (1-day) < 9, and\n" +
								"- Test Results Failed (1-day) < 90\n" +
								"LUCI Analysis has decreased the bug priority from P2 to P3."
							So(fakeStore.Issues[1].Comments, ShouldHaveLength, 3)
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring, expectedComment)
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring,
								"https://luci-analysis-test.appspot.com/help#priority-update")
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring,
								"https://luci-analysis-test.appspot.com/help#bug-reopened")
							So(fakeStore.Issues[1].Comments[2].Comment, ShouldContainSubstring,
								"https://luci-analysis-test.appspot.com/b/1")

							// Verify repeated update has no effect.
							updateDoesNothing()
						})
					})
				})
			})

			Convey("If bug duplicate", func() {
				fakeStore.Issues[1].Issue.IssueState.Status = issuetracker.Issue_DUPLICATE
				Convey("Unassigned", func() {
					expectedResponse := []bugs.BugUpdateResponse{
						{
							IsDuplicate:            true,
							IsDuplicateAndAssigned: false,
						},
					}
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.ModifiedTime, ShouldResembleProto, timestamppb.New(clock.Now(ctx)))
				})
				Convey("Assigned", func() {
					fakeStore.Issues[1].Issue.IssueState.Assignee = &issuetracker.User{
						EmailAddress: "user@google.com",
					}
					expectedResponse := []bugs.BugUpdateResponse{
						{
							IsDuplicate:            true,
							IsDuplicateAndAssigned: true,
						},
					}
					response, err := bm.Update(ctx, bugsToUpdate)
					So(err, ShouldBeNil)
					So(response, ShouldResemble, expectedResponse)
					So(fakeStore.Issues[1].Issue.ModifiedTime, ShouldResembleProto, timestamppb.New(clock.Now(ctx)))
				})
			})
			Convey("Rule not managing a bug archived after 30 days of the bug being in any closed state", func() {
				tc.Add(time.Hour * 24 * 30)

				bugsToUpdate[0].IsManagingBug = false
				fakeStore.Issues[1].Issue.IssueState.Status = issuetracker.Issue_FIXED

				expectedResponse := []bugs.BugUpdateResponse{
					{
						ShouldArchive: true,
					},
				}
				originalTime := timestamppb.New(fakeStore.Issues[1].Issue.ModifiedTime.AsTime())
				response, err := bm.Update(ctx, bugsToUpdate)
				So(err, ShouldBeNil)
				So(response, ShouldResemble, expectedResponse)
				So(fakeStore.Issues[1].Issue.ModifiedTime, ShouldResembleProto, originalTime)
			})
			Convey("Rule managing a bug not archived after 30 days of the bug being in fixed state", func() {
				tc.Add(time.Hour * 24 * 30)

				// If LUCI Analysis is mangaging the bug state, the fixed state
				// means the bug is still not verified. Do not archive the
				// rule.
				bugsToUpdate[0].IsManagingBug = true
				fakeStore.Issues[1].Issue.IssueState.Status = issuetracker.Issue_FIXED

				updateDoesNothing()
			})

			Convey("Rules archived immediately if bug archived", func() {
				fakeStore.Issues[1].Issue.IsArchived = true

				expectedResponse := []bugs.BugUpdateResponse{
					{
						ShouldArchive: true,
					},
				}
				response, err := bm.Update(ctx, bugsToUpdate)
				So(err, ShouldBeNil)
				So(response, ShouldResemble, expectedResponse)
			})
			Convey("If issue does not exist, does nothing", func() {
				fakeStore.Issues = nil
				response, err := bm.Update(ctx, bugsToUpdate)
				So(err, ShouldBeNil)
				So(len(response), ShouldEqual, len(bugsToUpdate))
				So(fakeStore.Issues, ShouldBeNil)
			})
		})
	})
}