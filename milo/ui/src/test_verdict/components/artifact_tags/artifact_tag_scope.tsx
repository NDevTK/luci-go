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

import { ReactNode } from 'react';

import { PortalScope } from '@/generic_libs/components/lit_react_portal';

import { ArtifactContextProvider } from './context';

export interface ArtifactTagScopeProps {
  readonly resultName: string;
  readonly children: ReactNode;
}

export function ArtifactTagScope({
  resultName,
  children,
}: ArtifactTagScopeProps) {
  return (
    <ArtifactContextProvider resultName={resultName}>
      <PortalScope>{children}</PortalScope>
    </ArtifactContextProvider>
  );
}