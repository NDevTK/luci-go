// Copyright 2020 The LUCI Authors.
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

import '@material/mwc-icon';
import { css, customElement } from 'lit-element';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { autorun, computed, makeObservable, observable } from 'mobx';

import { consumeInvocationState, InvocationState } from '../../context/invocation_state';
import { consumer } from '../../libs/context';
import { consumeStore, StoreInstance } from '../../store';
import commonStyle from '../../styles/common_style.css';
import { Invocation } from '../../services/resultdb';
import { MiloBaseElement } from '../../components/milo_base';
import { TimelineBlock } from '../../components/timeline';
import { DateTime } from 'luxon';

const MARGIN = 20;
const MIN_GRAPH_WIDTH = 900;

function stripInvocationPrefix(invocationName: string): string {
  return invocationName.slice('invocations/'.length);
}

@customElement('milo-invocation-details-tab')
@consumer
export class InvocationDetailsTabElement extends MiloBaseElement {
  @observable.ref
  @consumeStore()
  store!: StoreInstance;

  @observable.ref
  @consumeInvocationState()
  invocationState!: InvocationState;

  @computed
  private get hasTags() {
    return (this.invocationState.invocation!.tags || []).length > 0;
  }

  @observable
  private graphWidth = MIN_GRAPH_WIDTH;

  @observable
  private numRequestsCompleted = 0;

  private includedInvocations: { [name: string]: Invocation } = {};

  constructor() {
    super();
    makeObservable(this);
    this.addDisposer(
      autorun(() => {
        try {
          if (!this.invocationState || !this.invocationState.invocation || !this.invocationState.invocation.includedInvocations) {
            return;
          }
          for (const invocationName of this.invocationState.invocation!.includedInvocations || []) {
            this.store.services.resultDb?.getInvocation({ name: invocationName }).then(invocation => {
              this.includedInvocations[invocationName] = invocation;
              this.numRequestsCompleted += 1;
            }).catch((e) => {
              // TODO(mwarton): display the error to the user.
              console.error(e);
            })
          }
        } catch (e) {
          // TODO(mwarton): display the error to the user.
          console.error(e);
        }
      })
    );
  }

  private now = DateTime.now();

  connectedCallback() {
    super.connectedCallback();
    this.store.setSelectedTabId('invocation-details');
    this.now = DateTime.now();

    const syncWidth = () => {
      this.graphWidth = Math.max(window.innerWidth - 2 * MARGIN, MIN_GRAPH_WIDTH);
    };
    window.addEventListener('resize', syncWidth);
    this.addDisposer(() => window.removeEventListener('resize', syncWidth));
    syncWidth();
  }

  protected render() {
    const invocation = this.invocationState.invocation;
    if (invocation === null) {
      return html``;
    }

    const blocks: TimelineBlock[] = Object.values(this.includedInvocations).map(i => ({
      text: stripInvocationPrefix(i.name),
      href: `/ui/inv/${stripInvocationPrefix(i.name)}/invocation-details`,
      start: DateTime.fromISO(i.createTime),
      end: i.finalizeTime ? DateTime.fromISO(i.finalizeTime) : undefined,
    }));
    blocks.sort((a, b) => {
      if (a.end && (!b.end || a.end < b.end)) {
        return -1;
      } else if (b.end && (!a.end || a.end > b.end)) {
        return 1;
      } else {
        // Invocations always have a create time, no need for undefined checks here.
        return a.start!.toMillis() - b.start!.toMillis();
      }
    });
    return html`
      <div>Create Time: ${new Date(invocation.createTime).toLocaleString()}</div>
      <div>Finalize Time: ${new Date(invocation.finalizeTime).toLocaleString()}</div>
      <div>Deadline: ${new Date(invocation.deadline).toLocaleDateString()}</div>
      <div style=${styleMap({ display: this.hasTags ? '' : 'none' })}>
        Tags:
        <table id="tag-table" border="0">
          ${invocation.tags?.map(
          (tag) => html`
              <tr>
                <td>${tag.key}:</td>
                <td>${tag.value}</td>
              </tr>
            `
        )}
        </table>
      </div>
      <div id="included-invocations">
        ${invocation.includedInvocations?.length ?
          html`Included Invocations: (loaded ${this.numRequestsCompleted} of ${invocation.includedInvocations?.length})
                <milo-timeline
                  .width=${this.graphWidth}
                  .startTime=${DateTime.fromISO(invocation.createTime)}
                  .endTime=${invocation.finalizeTime ? DateTime.fromISO(invocation.finalizeTime) : this.now}
                  .blocks=${blocks}>
                </milo-timeline>` :
          'Included Invocations: None'}
      </div>
    `;
  }

  static styles = [
    commonStyle,
    css`
      :host {
        display: block;
        padding: 10px 20px;
      }

      #included-invocations ul {
        list-style-type: none;
        margin-block-start: auto;
        margin-block-end: auto;
        padding-inline-start: 32px;
      }

      #tag-table {
        margin-left: 29px;
      }
    `,
  ];
}