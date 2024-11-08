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

import fetchMock from 'fetch-mock-jest';
import { DateTime } from 'luxon';

import { DeepMutable } from '@/clusters/types/types';
import { Rule } from '@/proto/go.chromium.org/luci/analysis/proto/v1/rules.pb';

export const createDefaultMockRule = (): DeepMutable<Rule> => {
  const now = DateTime.now();
  return {
    name: 'projects/chromium/rules/ce83f8395178a0f2edad59fc1a167818',
    project: 'chromium',
    ruleId: 'ce83f8395178a0f2edad59fc1a167818',
    ruleDefinition: 'test = "blink_lint_expectations"',
    bug: {
      system: 'buganizer',
      id: '920702',
      linkText: 'b/920702',
      url: 'https://b/p/chromium/issues/detail?id=920702',
    },
    isActive: true,
    isManagingBug: true,
    isManagingBugPriority: true,
    isManagingBugPriorityLastUpdateTime: '2022-01-30T01:11:11.111111Z',
    sourceCluster: {
      algorithm: 'testname-v3',
      id: '78ff0812026b30570ca730b1541125ea',
    },
    bugManagementState: {
      policyState: [
        {
          policyId: 'exonerations',
          isActive: true,
          lastActivationTime: '2022-02-01T02:34:56.123456Z',
          lastDeactivationTime: undefined,
        },
        {
          policyId: 'cls-rejected',
          isActive: false,
          lastActivationTime: '2022-02-01T01:34:56.123456Z',
          lastDeactivationTime: '2022-02-01T02:04:56.123456Z',
        },
      ],
    },
    createTime: now.toISO(),
    createUser: 'system',
    lastAuditableUpdateTime: now.toISO(),
    lastAuditableUpdateUser: 'user@example.com',
    lastUpdateTime: now.toISO(),
    predicateLastUpdateTime: '2022-01-31T03:36:14.896430Z',
    etag: 'W/"2022-01-31T03:36:14.89643Z"',
  };
};

export const mockFetchRule = (rule: Rule) => {
  fetchMock.post(
    'https://staging.analysis.api.luci.app/prpc/luci.analysis.v1.Rules/Get',
    {
      headers: {
        'X-Prpc-Grpc-Code': '0',
      },
      body: ")]}'\n" + JSON.stringify(Rule.toJSON(rule)),
    },
  );
};

export const mockUpdateRule = (updatedRule: Rule) => {
  fetchMock.post(
    'https://staging.analysis.api.luci.app/prpc/luci.analysis.v1.Rules/Update',
    {
      headers: {
        'X-Prpc-Grpc-Code': '0',
      },
      body: ")]}'\n" + JSON.stringify(Rule.toJSON(updatedRule)),
    },
  );
};
