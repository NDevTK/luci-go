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

import { Link, TableCell } from '@mui/material';

import { useCommit, useRepoUrl } from './context';

export function PositionHeadCell() {
  return <TableCell width="1px">Commit</TableCell>;
}

export interface PositionContentCellProps {
  readonly position: string;
}

export function PositionContentCell({ position }: PositionContentCellProps) {
  const repoUrl = useRepoUrl();
  const commit = useCommit();

  return (
    <TableCell>
      <Link
        href={commit ? `${repoUrl}/+/${commit.id}` : undefined}
        target="_blank"
        rel="noreferrer"
        title={commit ? '' : 'loading the commit...'}
        sx={{
          fontWeight: 'bold',
          color: (theme) => (commit ? undefined : theme.palette.text.disabled),
        }}
      >
        {position}
      </Link>
    </TableCell>
  );
}
