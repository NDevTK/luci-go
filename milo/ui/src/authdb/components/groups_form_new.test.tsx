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

import { act } from 'react';
import { render, screen } from '@testing-library/react';
import { FakeContextProvider } from '@/testing_tools/fakes/fake_context_provider';
import List from '@mui/material/List';
import { GroupsFormNew } from './groups_form_new';
import userEvent from '@testing-library/user-event';

describe('<GroupsFormNew />', () => {
  test('if group name, description textarea is displayed', async () => {

    render(
      <FakeContextProvider>
        <List>
            <GroupsFormNew/>
        </List>
      </FakeContextProvider>,
    );

    await screen.findByTestId('groups-form-new');
    expect(screen.getByTestId('name-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('description-textarea')).toBeInTheDocument();
  });

  test('error is shown if creating invalid name', async () => {

    render(
      <FakeContextProvider>
        <List>
            <GroupsFormNew/>
        </List>
      </FakeContextProvider>,
    );

    await screen.findByTestId('groups-form-new');
    const textarea = screen.getByTestId('name-textarea');
    textarea.focus();
    await userEvent.type(textarea!, 'Invalid name');
    const createButton = screen.getByTestId('create-button');
    act(() => createButton.click());
    await screen.findByTestId('name-error');
    expect(screen.getByText('Invalid group name.')).toBeInTheDocument();
  });

  test('error is shown on empty description', async () => {

    render(
      <FakeContextProvider>
        <List>
            <GroupsFormNew/>
        </List>
      </FakeContextProvider>,
    );

    await screen.findByTestId('groups-form-new');
    const createButton = screen.getByTestId('create-button');
    act(() => createButton.click());
    await screen.findByTestId('description-error');
    expect(screen.getByText('Description is required.')).toBeInTheDocument();
  });

  test('error is shown on invalid owners name', async () => {

    render(
      <FakeContextProvider>
        <List>
            <GroupsFormNew/>
        </List>
      </FakeContextProvider>,
    );

    await screen.findByTestId('groups-form-new');
    const textarea = screen.getByTestId('owners-textfield');
    textarea.focus();
    await userEvent.type(textarea!, 'Invalid owners');
    const createButton = screen.getByTestId('create-button');
    act(() => createButton.click());
    await screen.findByTestId('owners-error');
    expect(screen.getByText('Invalid owners name. Must be a group.')).toBeInTheDocument();
  });
});