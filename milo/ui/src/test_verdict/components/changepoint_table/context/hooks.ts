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

import { useContext } from 'react';

import {
  BlamelistDispatcherCtx,
  BlamelistStateCtx,
  ChangeTableCtx,
} from './context';

export function useBlamelistDispatch() {
  const ctx = useContext(BlamelistDispatcherCtx);
  if (ctx === undefined) {
    throw new Error(
      'useBlamelistDispatch can only be used in a BlamelistStateProvider',
    );
  }
  return ctx;
}

export function useBlamelistState() {
  const ctx = useContext(BlamelistStateCtx);
  if (ctx === undefined) {
    throw new Error(
      'useBlamelistState can only be used in a BlamelistStateProvider',
    );
  }
  return ctx;
}

export function useConfig() {
  const ctx = useContext(ChangeTableCtx);
  if (ctx === undefined) {
    throw new Error(
      'useConfig can only be used in a ChangepointTableContextProvider',
    );
  }
  return ctx;
}