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

import { Link, TableCell } from '@mui/material';

import {
  getBuildURLPathFromBuildData,
  getBuilderURLPath,
  getProjectURLPath,
} from '@/common/tools/url_utils';

import { useRowState } from './context';

export function BuildIdentifierHeadCell() {
  return <TableCell width="1px">Build</TableCell>;
}

export function BuildIdentifierContentCell() {
  const build = useRowState();

  return (
    <TableCell>
      <Link href={getProjectURLPath(build.builder.project)}>
        {build.builder.project}
      </Link>
      /{build.builder.bucket}/
      <Link href={getBuilderURLPath(build.builder)}>
        {build.builder.builder}
      </Link>
      /
      <Link href={getBuildURLPathFromBuildData(build)}>
        {build.number ?? 'b' + build.id}
      </Link>
    </TableCell>
  );
}