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

import { createContext } from 'react';

import { ProjectMetric } from '@/proto/go.chromium.org/luci/analysis/proto/v1/metrics.pb';

interface OverviewTabData {
  metrics: ProjectMetric[];
}

export const OverviewTabContextData = createContext<OverviewTabData>({
  metrics: [],
});

interface Props {
  metrics?: ProjectMetric[];
  children: React.ReactNode;
}

export const OverviewTabContextProvider = ({ metrics, children }: Props) => {
  return (
    <OverviewTabContextData.Provider
      value={{
        metrics: metrics || [],
      }}
    >
      {children}
    </OverviewTabContextData.Provider>
  );
};