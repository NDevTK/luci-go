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

import { Instance, types } from 'mobx-state-tree';

/**
 * An utility model that provide utility methods to delete keys created before
 * the specified time.
 */
export const TransientKeySet = types
  .model('TransientKeySet', {
    /**
     * SHOULD NOT BE ACCESSED DIRECTLY. Use the methods instead.
     */
    // Map<StepName, UpdatedAt>
    _values: types.map(types.Date),
  })
  .actions((self) => ({
    add(key: string) {
      self._values.set(key, Date.now());
    },
    delete(key: string) {
      self._values.delete(key);
    },
    deleteStaleKeys(before: Date) {
      for (const [key, updatedAt] of self._values.entries()) {
        if (updatedAt < before) {
          self._values.delete(key);
        }
      }
    },
  }))
  .views((self) => ({
    has(key: string) {
      return self._values.has(key);
    },
    keys() {
      return self._values.keys();
    },
  }));

export type TransientKeySetInstance = Instance<typeof TransientKeySet>;
