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

export interface RoutedTabsState {
  readonly activeTab: {
    readonly id: string;
    readonly hookRef: unknown;
  } | null;
}

export type Action = {
  readonly type: 'activateTab' | 'deactivateTab';
  /**
   * The ID of the tab. Used to inform `<RoutedTabs />` which tab should be
   * highlighted.
   */
  readonly id: string;
  /**
   * A reference that uniquely identifies a `useTabId` call in a component.
   *
   * For a given `<RoutedTabs />`, only one `useTabId` call can exist in its
   * descendants at any time.
   */
  readonly hookRef: unknown;
};

export function reducer(
  state: RoutedTabsState,
  action: Action,
): RoutedTabsState {
  switch (action.type) {
    case 'activateTab': {
      if (
        state.activeTab !== null &&
        state.activeTab.hookRef !== action.hookRef
      ) {
        throw new Error(
          `cannot activate a tab when there's already an active tab; ` +
            `active: ${state.activeTab.id}}; ` +
            `activating: ${action.id}`,
        );
      }
      return { activeTab: { id: action.id, hookRef: action.hookRef } };
    }
    case 'deactivateTab': {
      if (state.activeTab?.hookRef !== action.hookRef) {
        throw new Error(
          `cannot deactivate an inactive tab; ` +
            `active: ${state.activeTab?.id ?? null}}; ` +
            `deactivating: ${action.id}`,
        );
      }
      return { activeTab: null };
    }
  }
}
