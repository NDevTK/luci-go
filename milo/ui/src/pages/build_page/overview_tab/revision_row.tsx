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

import { getGitilesCommitURL } from '../../../libs/url_utils';
import { GitilesCommit } from '../../../services/buildbucket';

export interface RevisionRowParams {
  readonly commit: GitilesCommit;
}

export function RevisionRow({ commit }: RevisionRowParams) {
  return (
    <tr>
      <td>Revision:</td>
      <td>
        <a href={getGitilesCommitURL(commit)} target="_blank">
          {commit.id}
        </a>
        {commit.position ? ` CP #${commit.position}` : ''}
      </td>
    </tr>
  );
}