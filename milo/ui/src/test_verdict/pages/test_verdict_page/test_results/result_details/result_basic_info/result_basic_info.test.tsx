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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TestResult, TestStatus } from '@/common/services/resultdb';

import { ResultBasicInfo } from './result_basic_info';

describe('<ResultBasicInfo />', () => {
  const failedResult: TestResult = {
    testId: 'tast.inputs.VirtualKeyboardAutocorrect.fr_fr_a11y',
    name:
      'invocations/u-chrome-bot-2023-10-25-09-08-00-26592efa1f477db0/tests/' +
      'tast.inputs.VirtualKeyboardAutocorrect.fr_fr_a11y/results/87ecc8c3-00063',
    resultId: '87ecc8c3-00063',
    status: TestStatus.Fail,
    summaryHtml: '<text-artifact artifact-id="Test Log" />',
    startTime: '2023-10-25T09:01:00.167244802Z',
    duration: '55.567s',
    tags: [
      {
        key: 'ancestor_buildbucket_ids',
        value: '8766287273535464561',
      },
      {
        key: 'board',
        value: 'betty-pi-arc',
      },
      {
        key: 'bug_component',
        value: 'b:95887',
      },
    ],
    failureReason: {
      primaryErrorMessage:
        'Failed to validate VK autocorrect: failed to validate VK autocorrect on step 4: failed' +
        ' to validate field text on step 2: failed to validate input value: got: francais ; want: français',
    },
  };

  it('given error reason, should display error block', async () => {
    render(<ResultBasicInfo result={failedResult} />);
    await screen.findByText('Details');
    expect(
      screen.getByText(
        'Failed to validate VK autocorrect: failed to validate VK autocorrect on step 4: failed' +
          ' to validate field text on step 2: failed to validate input value: got: francais ; want: français',
      ),
    ).toBeInTheDocument();
  });

  it('given error reason, should be displayed instead of `Details` when collapsed', async () => {
    render(<ResultBasicInfo result={failedResult} />);
    await screen.findByText('Details');
    await userEvent.click(screen.getByText('Details'));

    expect(screen.queryByText('Details')).not.toBeInTheDocument();
    expect(
      screen.getAllByText(
        'Failed to validate VK autocorrect: failed to validate VK autocorrect on step 4: failed' +
          ' to validate field text on step 2: failed to validate input value: got: francais ; want: français',
      ),
    ).toHaveLength(2);
  });

  it('given a duration, then should be displayed and formatted correctly', async () => {
    render(<ResultBasicInfo result={failedResult} />);
    await screen.findByText('Details');

    expect(screen.getByText('56s')).toBeInTheDocument();
  });

  it('given an invocation id that belongs to a task, then should display swarming task link', async () => {
    const failedResult: TestResult = {
      testId: 'tast.inputs.VirtualKeyboardAutocorrect.fr_fr_a11y',
      name:
        'invocations/task-chromium-swarm.appspot.com-659c82e40f213711/tests/' +
        'ninja:%2F%2F:blink_web_tests%2Ffast%2Fbackgrounds%2Fbackground-position-parsing.html/results/b5b8a970-03989',
      resultId: '87ecc8c3-00063',
      status: TestStatus.Fail,
      summaryHtml: '<text-artifact artifact-id="Test Log" />',
      startTime: '2023-10-25T09:01:00.167244802Z',
      failureReason: {
        primaryErrorMessage:
          'Failed to validate VK autocorrect: failed to validate VK autocorrect on step 4: failed' +
          ' to validate field text on step 2: failed to validate input value: got: francais ; want: français',
      },
    };

    render(<ResultBasicInfo result={failedResult} />);
    expect(screen.getByText('659c82e40f213711')).toBeInTheDocument();
  });
});