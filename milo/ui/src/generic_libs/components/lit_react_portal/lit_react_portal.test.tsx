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

import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createContext, useContext, useState } from 'react';

import { LitReactPortalElement } from './lit_react_portal';
import { PortalScope } from './portal_scope';

const TestContext = createContext('val');

class TestElement extends LitReactPortalElement {
  static get properties() {
    return {
      property: {
        attribute: 'property',
        type: String,
      },
    };
  }

  private _property = '';
  get property() {
    return this._property;
  }
  set property(newVal: string) {
    if (newVal === this._property) {
      return;
    }
    const oldVal = this._property;
    this._property = newVal;
    this.requestUpdate('property', oldVal);
  }

  renderReact() {
    return <TestComponent property={this.property} />;
  }
}
customElements.define('milo-test-element', TestElement);

interface TestComponentProps {
  readonly property: string;
}

function TestComponent({ property }: TestComponentProps) {
  const ctx = useContext(TestContext);
  const [state, setState] = useState(0);

  return (
    <>
      <div data-testid="property">{property}</div>
      <div data-testid="context">{ctx}</div>
      <div data-testid="state">{state}</div>
      <button onClick={() => setState((s) => s + 1)} />
    </>
  );
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'milo-test-element': {
        readonly property: string;
      };
    }
  }
}

describe('LitReactPortalElement', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('can handle property update', async () => {
    const { rerender } = render(
      <PortalScope>
        <milo-test-element property="val1"></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(screen.getByTestId('property')).toHaveTextContent('val1');

    rerender(
      <PortalScope>
        <milo-test-element property="val2"></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(screen.getByTestId('property')).toHaveTextContent('val2');
  });

  it('can handle context update', async () => {
    const { rerender } = render(
      <TestContext.Provider value="val1">
        <PortalScope>
          <milo-test-element
            data-testid="element"
            property="val"
          ></milo-test-element>
        </PortalScope>
      </TestContext.Provider>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(screen.getByTestId('context')).toHaveTextContent('val1');

    rerender(
      <TestContext.Provider value="val2">
        <PortalScope>
          <milo-test-element
            data-testid="element"
            property="val"
          ></milo-test-element>
        </PortalScope>
      </TestContext.Provider>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(screen.getByTestId('context')).toHaveTextContent('val2');
  });

  it('can handle state update', async () => {
    render(
      <PortalScope>
        <milo-test-element property="val1"></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(screen.getByTestId('state')).toHaveTextContent('0');

    userEvent.click(screen.getByRole('button'));
    await act(() => jest.runAllTimersAsync());
    expect(screen.getByTestId('state')).toHaveTextContent('1');
  });

  it('can handle adding element', async () => {
    const { rerender } = render(
      <PortalScope>
        <milo-test-element
          data-testid="element1"
          property="val1"
        ></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(
      screen.getByTestId('element1').querySelector('[data-testid="property"]'),
    ).toHaveTextContent('val1');

    rerender(
      <PortalScope>
        <milo-test-element
          data-testid="element1"
          property="val1"
        ></milo-test-element>
        <milo-test-element
          data-testid="element2"
          property="val2"
        ></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(
      screen.getByTestId('element1').querySelector('[data-testid="property"]'),
    ).toHaveTextContent('val1');
    expect(
      screen.getByTestId('element2').querySelector('[data-testid="property"]'),
    ).toHaveTextContent('val2');
  });

  it('can handle removing element', async () => {
    const { rerender } = render(
      <PortalScope>
        <milo-test-element
          data-testid="element1"
          property="val1"
        ></milo-test-element>
        <milo-test-element
          data-testid="element2"
          property="val2"
        ></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(
      screen.getByTestId('element1').querySelector('[data-testid="property"]'),
    ).toHaveTextContent('val1');
    expect(
      screen.getByTestId('element2').querySelector('[data-testid="property"]'),
    ).toHaveTextContent('val2');

    rerender(
      <PortalScope>
        <milo-test-element
          data-testid="element1"
          property="val1"
        ></milo-test-element>
      </PortalScope>,
    );
    await act(() => jest.runAllTimersAsync());
    expect(
      screen.getByTestId('element1').querySelector('[data-testid="property"]'),
    ).toHaveTextContent('val1');
    expect(screen.queryByTestId('element2')).not.toBeInTheDocument();
  });
});