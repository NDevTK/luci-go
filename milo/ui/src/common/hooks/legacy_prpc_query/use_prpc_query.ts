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

import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import {
  useAuthState,
  useGetAccessToken,
} from '@/common/components/auth_state_provider';
import { PrpcClientExt } from '@/generic_libs/tools/prpc_client_ext';

import {
  PrpcMethod,
  PrpcMethodRequest,
  PrpcMethodResponse,
  PrpcQueryBaseOptions,
  PrpcServiceMethodKeys,
  genPrpcQueryKey,
} from './common';

export interface UsePrpcQueryOptions<S, MK, Req, Res, TError, TData>
  extends PrpcQueryBaseOptions<S, MK, Req> {
  /**
   * options will be passed to `useQuery` from `@tanstack/react-query`.
   */
  readonly options?: Omit<
    UseQueryOptions<
      Res,
      TError,
      TData,
      readonly [string, string, string, MK, Req]
    >,
    'queryKey' | 'queryFn'
  >;
}

/**
 * @deprecated use `usePrpcQuery` from `@common/hooks/prpc_query` instead.
 *
 * Call a pRPC method via `@tanstack/react-query`.
 *
 * This hook
 *  * reduces boilerplate, and
 *  * ensures the `queryKey` is populated correctly.
 */
export function usePrpcQuery<
  S extends object,
  MK extends PrpcServiceMethodKeys<S>,
  TError = unknown,
  TData = PrpcMethodResponse<S[MK]>,
>(
  opts: UsePrpcQueryOptions<
    S,
    MK,
    PrpcMethodRequest<S[MK]>,
    PrpcMethodResponse<S[MK]>,
    TError,
    TData
  >,
): UseQueryResult<TData, TError> {
  const { host, insecure, Service, method, request, options } = opts;

  const { identity } = useAuthState();
  const getAccessToken = useGetAccessToken();
  const queryKey = genPrpcQueryKey(identity, opts);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const service = new Service(
        new PrpcClientExt({ host, insecure }, getAccessToken),
      );
      // `method` is constrained to be a key that has an associated property of
      // type `PrpcMethod` in a `Service`. Therefore `service[method]` is
      // guaranteed to be a `PrpcMethod`. TSC isn't smart enough to know that,
      // so we need to use type casting.
      return await (
        service[method] as PrpcMethod<
          PrpcMethodRequest<S[MK]>,
          PrpcMethodResponse<S[MK]>
        >
      )(
        request,
        // Let react-query handle caching.
        {
          acceptCache: false,
          skipUpdate: true,
        },
      );
    },
    ...options,
  });
}
