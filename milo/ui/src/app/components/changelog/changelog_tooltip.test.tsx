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

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import { FakeContextProvider } from '@/testing_tools/fakes/fake_context_provider';

import { ChangelogProvider } from './changelog_provider';
import { ChangelogTooltip } from './changelog_tooltip';

describe('ChangelogTooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
    cleanup();
  });

  it('only renders the latest changelog', () => {
    render(
      <FakeContextProvider>
        <ChangelogProvider
          initChangelog={{
            latest: 'new changelog',
            latestVersion: 10,
            past: 'old changelog',
          }}
        >
          <ChangelogTooltip>
            <div></div>
          </ChangelogTooltip>
        </ChangelogProvider>
      </FakeContextProvider>,
    );
    expect(screen.getByText('new changelog')).toBeInTheDocument();
    expect(screen.queryByText('old changelog')).not.toBeInTheDocument();
  });

  it('can dismiss changelog', async () => {
    render(
      <FakeContextProvider>
        <ChangelogProvider
          initChangelog={{
            latest: 'new changelog',
            latestVersion: 10,
            past: 'old changelog',
          }}
        >
          <ChangelogTooltip>
            <div></div>
          </ChangelogTooltip>
        </ChangelogProvider>
      </FakeContextProvider>,
    );
    expect(screen.getByText('new changelog')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Dismiss'));
    await act(() => jest.advanceTimersByTimeAsync(1000));
    await act(() => jest.advanceTimersByTimeAsync(1000));
    expect(screen.queryByText('new changelog')).not.toBeInTheDocument();
  });

  it('can dismiss changelog by clicking away', async () => {
    render(
      <FakeContextProvider>
        <ChangelogProvider
          initChangelog={{
            latest: 'new changelog',
            latestVersion: 10,
            past: 'old changelog',
          }}
        >
          <ChangelogTooltip>
            <div></div>
          </ChangelogTooltip>
        </ChangelogProvider>
      </FakeContextProvider>,
    );
    expect(screen.getByText('new changelog')).toBeInTheDocument();

    // Persist the tooltip for a while initially.
    act(() => fireEvent.mouseDown(document.body));
    await act(() => jest.advanceTimersByTimeAsync(1000));
    expect(screen.queryByText('new changelog')).toBeInTheDocument();

    // Still persist after 5s when there are no more clicks.
    await act(() => jest.advanceTimersByTimeAsync(5000));
    expect(screen.queryByText('new changelog')).toBeInTheDocument();

    // Dismiss when the user clicks away after 5s.
    act(() => fireEvent.mouseDown(document.body));
    await act(() => jest.advanceTimersByTimeAsync(1000));
    await act(() => jest.advanceTimersByTimeAsync(1000));
    expect(screen.queryByText('new changelog')).not.toBeInTheDocument();
  });
});