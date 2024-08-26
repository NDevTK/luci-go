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

import { TestVerdictCtx } from './context';

export function useInvocationID() {
  const context = useContext(TestVerdictCtx);
  if (!context) {
    throw Error('useInvocationID can only be used in a TestVerdictProvider.');
  }
  return context.invocationID;
}

export function useProject() {
  const context = useContext(TestVerdictCtx);
  if (!context) {
    throw Error('useProject can only be used in a TestVerdictProvider.');
  }
  return context.project;
}

export function useTestVerdict() {
  const context = useContext(TestVerdictCtx);
  if (!context) {
    throw Error('useTestVerdict can only be used in a TestVerdictProvider.');
  }
  return context.testVerdict;
}

export function useSetTestVerdict() {
  const context = useContext(TestVerdictCtx);
  if (!context) {
    throw Error('useSetTestVerdict can only be used in a TestVerdictProvider.');
  }
  return context.setTestVerdict;
}

export function useSources() {
  const context = useContext(TestVerdictCtx);
  if (!context) {
    throw Error('useSources can only be used in a TestVerdictProvider.');
  }
  return context.sources;
}
