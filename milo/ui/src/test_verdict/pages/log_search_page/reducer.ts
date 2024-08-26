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

import { Variant } from '@/proto/go.chromium.org/luci/resultdb/proto/v1/common.pb';

export interface InvocationLogGroupIdentifier {
  readonly variantUnionHash: string;
  readonly variantUnion?: Variant;
  readonly artifactID: string;
}

export interface TestLogGroupIdentifier {
  readonly testID: string;
  readonly variantHash: string;
  readonly variant?: Variant;
  readonly artifactID: string;
}

export interface LogGroupListState {
  readonly testLogGroupIdentifier: TestLogGroupIdentifier | null;
  readonly invocationLogGroupIdentifier: InvocationLogGroupIdentifier | null;
}

interface ShowTestLogGroupListAction {
  readonly type: 'showTestLogGroupList';
  readonly logGroupIdentifer: TestLogGroupIdentifier;
}

interface ShowInvocationGroupListAction {
  readonly type: 'showInvocationLogGroupList';
  readonly logGroupIdentifer: InvocationLogGroupIdentifier;
}

interface DismissAction {
  readonly type: 'dismiss';
}

export type Action =
  | ShowTestLogGroupListAction
  | ShowInvocationGroupListAction
  | DismissAction;

export function reducer(
  _state: LogGroupListState,
  action: Action,
): LogGroupListState {
  switch (action.type) {
    case 'showTestLogGroupList':
      return {
        testLogGroupIdentifier: action.logGroupIdentifer,
        invocationLogGroupIdentifier: null,
      };
    case 'showInvocationLogGroupList':
      return {
        testLogGroupIdentifier: null,
        invocationLogGroupIdentifier: action.logGroupIdentifer,
      };
    case 'dismiss':
      return {
        testLogGroupIdentifier: null,
        invocationLogGroupIdentifier: null,
      };
  }
}
