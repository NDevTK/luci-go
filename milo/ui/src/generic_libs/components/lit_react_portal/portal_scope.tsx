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

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  CLOSE_PORTAL_EVENT,
  LitReactPortalElement,
  OPEN_PORTAL_EVENT,
} from './lit_react_portal';
import { PortalRenderer } from './portal_renderer';

export interface PortalScopeProps {
  readonly children: ReactNode;
}

/**
 * Enables the use of `LitReactPortalElement` based custom web components.
 */
export function PortalScope({ children }: PortalScopeProps) {
  const [_, setState] = useState({});
  const portalsRef = useRef<Map<LitReactPortalElement, number>>();
  const trackerRef = useRef<LitReactPortalTrackerElement>();
  useEffect(() => {
    const tracker = trackerRef.current!;

    if (portalsRef.current === undefined) {
      // When `portalsRef` is initialized and there are some registered portals
      // already, trigger a rerender immediately.
      if (tracker[PORTALS].size !== 0) {
        setState({});
      }
    }
    portalsRef.current = tracker[PORTALS];

    // Rerender whenever there's an update on the portals set.
    function onPortalsUpdated(e: Event) {
      e.stopPropagation();
      setState({});
    }
    tracker.addEventListener(PORTALS_UPDATED_EVENT, onPortalsUpdated);
    return () =>
      tracker.removeEventListener(PORTALS_UPDATED_EVENT, onPortalsUpdated);
  }, []);

  return (
    // In Lit, the portal open event is fired during connection phase. In React,
    // we can only add custom event handler to an element after it's rendered
    // (and connected), therefore the custom event handler may miss portals
    // that are rendered in the same rendering cycle as `<PortalScope />`.
    //
    // Custom web component can attach event handlers during connection phase.
    // Use a web component to collect all the portals so we don't miss any
    // event fired during the connection phase.
    <lit-react-portal-tracker ref={trackerRef}>
      {children}
      {[...(portalsRef.current?.entries() || [])].map(([node, id]) => (
        <PortalRenderer key={id} portal={node} />
      ))}
    </lit-react-portal-tracker>
  );
}

const PORTALS_UPDATED_EVENT = 'portals-updated';

// Use a symbol to ensure the property cannot be accessed anywhere else.
const PORTALS = Symbol('portals');

@customElement('lit-react-portal-tracker')
class LitReactPortalTrackerElement extends LitElement {
  private nextId = 0;
  readonly [PORTALS] = new Map<LitReactPortalElement, number>();

  private onOpenPortal = (e: Event) => {
    const event = e as CustomEvent<LitReactPortalElement>;
    if (this[PORTALS].has(event.detail)) {
      return;
    }
    this[PORTALS].set(event.detail, this.nextId);
    this.nextId++;
    this.dispatchEvent(new CustomEvent(PORTALS_UPDATED_EVENT));
  };

  private onClosePortal = (e: Event) => {
    const event = e as CustomEvent<LitReactPortalElement>;
    if (!this[PORTALS].has(event.detail)) {
      return;
    }
    this[PORTALS].delete(event.detail);
    this.dispatchEvent(new CustomEvent(PORTALS_UPDATED_EVENT));
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(OPEN_PORTAL_EVENT, this.onOpenPortal);
    this.addEventListener(CLOSE_PORTAL_EVENT, this.onClosePortal);
  }

  disconnectedCallback(): void {
    this.removeEventListener(CLOSE_PORTAL_EVENT, this.onClosePortal);
    this.removeEventListener(OPEN_PORTAL_EVENT, this.onOpenPortal);

    if (this[PORTALS].size !== 0) {
      this[PORTALS].clear();
      this.dispatchEvent(new CustomEvent(PORTALS_UPDATED_EVENT));
    }

    super.connectedCallback();
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'lit-react-portal-tracker': {
        readonly ref: MutableRefObject<
          LitReactPortalTrackerElement | undefined
        >;
        readonly children: ReactNode;
      };
    }
  }
}