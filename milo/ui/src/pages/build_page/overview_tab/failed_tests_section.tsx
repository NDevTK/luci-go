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

import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { DotSpinner } from '../../../components/dot_spinner';
import { getBuildURLPath, getTestHisotryURLPath } from '../../../libs/url_utils';
import { urlSetSearchQueryParam } from '../../../libs/utils';
import { getPropKeyLabel } from '../../../services/resultdb';
import { useStore } from '../../../store';
import { useInvocation } from '../../../store/invocation_state';
import { TestVariantEntry } from '../../test_results_tab/test_variants_table/test_variant_entry';

const MAX_DISPLAYED_UNEXPECTED_TESTS = 10;

interface HeaderProps {
  readonly url: string;
}

function Header({ url }: HeaderProps) {
  return (
    <h3>
      Failed Tests (<Link to={url}>View All Tests</Link>)
    </h3>
  );
}

export const FailedTestSection = observer(() => {
  const store = useStore();
  const invState = useInvocation();
  const testLoader = invState.testLoader;

  if (!store.buildPage.builderIdParam || !store.buildPage.buildNumOrIdParam) {
    return <></>;
  }

  const testsTabUrl =
    getBuildURLPath(store.buildPage.builderIdParam, store.buildPage.buildNumOrIdParam) + '/test-results';

  if (!testLoader) {
    return (
      <>
        <Header url={testsTabUrl} />
        <div css={{ marginBottom: '25px' }}>
          <div css={{ color: 'var(--active-text-color)' }}>
            Loading <DotSpinner />
          </div>
        </div>
      </>
    );
  }

  // Overview tab is more crowded than the test results tab.
  // Hide all additional columns.
  const columnWidths = '24px ' + invState.columnWidths.map(() => '0').join(' ') + ' 1fr';
  const displayedTVCount = Math.min(testLoader.unfilteredUnexpectedVariantsCount, MAX_DISPLAYED_UNEXPECTED_TESTS);

  const groupDefs = invState.groupers
    .filter(([key]) => key !== 'status')
    .map(([key, getter]) => [getPropKeyLabel(key), getter] as [string, typeof getter]);

  const lists: JSX.Element[] = [];

  let remainingEntry = displayedTVCount;

  renderTestList: for (const group of testLoader.groupedUnfilteredUnexpectedVariants) {
    if (groupDefs.length !== 0) {
      lists.push(
        <h4>
          {groupDefs.map(([label, getter]) => (
            <>
              {label}: {getter(group[0])}
            </>
          ))}
        </h4>
      );
    }

    for (const testVariant of group) {
      lists.push(
        <TestVariantEntry
          key={testVariant.testId + '|' + testVariant.variantHash}
          variant={testVariant}
          columnGetters={invState.columnGetters}
          historyUrl={urlSetSearchQueryParam(
            getTestHisotryURLPath(store.buildPage.build!.data.builder.project, testVariant.testId),
            'VHASH',
            testVariant.variantHash
          )}
        />
      );
      remainingEntry--;
      if (remainingEntry === 0) {
        break renderTestList;
      }
    }
  }

  return (
    <>
      <Header url={testsTabUrl} />
      <div css={{ marginBottom: '25px' }}>
        <div css={{ '--tvt-columns': columnWidths }}>{lists}</div>
        <div css={{ marginTop: '10px' }}>
          {testLoader.unfilteredUnexpectedVariantsCount === 0 ? (
            'No failed tests.'
          ) : (
            <>
              Showing {displayedTVCount}/{testLoader.unfilteredUnexpectedVariantsCount} failed tests.{' '}
              <Link to={testsTabUrl} css={{ color: 'var(--default-text-color)' }}>
                [view all]
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
});