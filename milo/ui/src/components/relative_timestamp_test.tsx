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

import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { DateTime, Duration } from 'luxon';
import * as sinon from 'sinon';

import './relative_timestamp';
import { RelativeTimestamp } from './relative_timestamp';

describe('relative_timestamp_test', () => {
  let timer: sinon.SinonFakeTimers;

  beforeEach(() => {
    timer = sinon.useFakeTimers();
  });

  afterEach(() => {
    timer.restore();
  });

  it('should display timestamp in the past correctly', async () => {
    const timestamp = DateTime.now().minus(Duration.fromObject({ seconds: 20, millisecond: 500 }));

    render(<RelativeTimestamp timestamp={timestamp} />);

    expect(screen.queryByText('20 secs ago')).to.not.be.null;
  });

  it('should display timestamp in the future correctly', async () => {
    const timestamp = DateTime.now().plus(Duration.fromObject({ seconds: 20, millisecond: 500 }));

    render(<RelativeTimestamp timestamp={timestamp} />);

    expect(screen.queryByText('in 20 secs')).to.not.be.null;
  });

  it('should update timestamp correctly', async () => {
    const timestamp = DateTime.now().plus(Duration.fromObject({ seconds: 2, millisecond: 500 }));

    render(<RelativeTimestamp timestamp={timestamp} />);

    expect(screen.queryByText('in 2 secs')).to.not.be.null;

    await timer.tickAsync('00:05');

    expect(screen.queryByText('2 secs ago')).to.not.be.null;
  });
});