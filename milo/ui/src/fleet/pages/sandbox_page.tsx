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
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import bassFavicon from '@/common/assets/favicons/bass-32.png';
import { RecoverableErrorBoundary } from '@/common/components/error_handling';
import { PageMeta } from '@/common/components/page_meta';
import { usePrpcServiceClient } from '@/common/hooks/prpc_query';
import { GenFeedbackUrlArgs } from '@/common/tools/utils';
import { TrackLeafRoutePageView } from '@/generic_libs/components/google_analytics';
import {
  FleetClientImpl,
  ListMachinesRequest,
} from '@/proto/infra/unifiedfleet/api/v1/rpc/fleet.pb';

const SandboxPage = () => {
  // TODO(b/369951471): Update this page to use a shared base layout with
  // shared code for setting the favicon, fedback URL, etc.

  // See go/luci-ui-rpc-tutorial for more info on how to make pRPC requests.
  const ufsClient = usePrpcServiceClient({
    host: 'staging.ufs.api.cr.dev',
    ClientImpl: FleetClientImpl,
    additionalHeaders: { namespace: 'os' },
  });

  const machines = useQuery({
    ...ufsClient.ListMachines.query(
      ListMachinesRequest.fromPartial({
        pageSize: 10,
      }),
    ),
    refetchInterval: 60000,
  });

  return (
    <>
      <PageMeta title="Fleet Console" favicon={bassFavicon} />
      Welcome. This is a sandbox page with experiments and tools for developers
      of the Fleet Console to use for testing the functionality of the Fleet
      Console UI.
      <h2>Sample: UFS-dev ListMachinesRequest</h2>
      <pre style={{ maxHeight: '300px', maxWidth: '100%', overflow: 'scroll' }}>
        {JSON.stringify(machines, null, 2)}
      </pre>
    </>
  );
};

export function Component() {
  const { setFeedbackUrlArgs } = useOutletContext() as {
    setFeedbackUrlArgs: React.Dispatch<
      React.SetStateAction<GenFeedbackUrlArgs>
    >;
  };

  useEffect(() => {
    setFeedbackUrlArgs({ bugComponent: '1664178' });
    return () => setFeedbackUrlArgs(undefined);
  }, [setFeedbackUrlArgs]);

  return (
    <TrackLeafRoutePageView contentGroup="fleet-console-sandbox">
      <RecoverableErrorBoundary
        // See the documentation for `<LoginPage />` for why we handle error
        // this way.
        key="fleet-sandbox-page"
      >
        <SandboxPage />
      </RecoverableErrorBoundary>
    </TrackLeafRoutePageView>
  );
}