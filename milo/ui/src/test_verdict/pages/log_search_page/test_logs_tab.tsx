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

import { useParams } from 'react-router-dom';

import { RecoverableErrorBoundary } from '@/common/components/error_handling';
import { useTabId } from '@/generic_libs/components/routed_tabs';

import { useSearchFilter } from './contexts';
import { TestLogDialog } from './log_list_dialog';
import { TestLogsTable } from './log_table';
// TODO (beining@):
// * link to log viewer.
// * only perform the search after some validation of the form.
export function TestLogsTab() {
  const { project } = useParams();
  if (!project) {
    throw new Error('project must be set');
  }
  const searchFilter = useSearchFilter();

  return (
    <>
      {searchFilter && (
        <TestLogsTable project={project} filter={searchFilter} />
      )}
      <TestLogDialog project={project} />
    </>
  );
}

export function Component() {
  useTabId('test-logs');

  return (
    // See the documentation for `<LoginPage />` for why we handle error this
    // way.
    <RecoverableErrorBoundary key="test-logs">
      <TestLogsTab />
    </RecoverableErrorBoundary>
  );
}