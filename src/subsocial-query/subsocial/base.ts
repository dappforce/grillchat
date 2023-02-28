import type { ApiPromise } from '@polkadot/api'
import { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import {
  useMutation,
  UseMutationResult,
  useQueries,
  useQuery,
} from '@tanstack/react-query'
import {
  createQueryInvalidation,
  createQueryKeys,
  createTxAndSend,
  makeCombinedCallback,
  mergeQueryConfig,
  queryWrapper,
} from '..'
import {
  MutationConfig,
  QueryConfig,
  Transaction,
  WalletAccount,
} from '../types'
import { getConnectionConfig } from './config'
import { getSubsocialApi } from './connection'

export type SubsocialParam<T> = { data: T } & { api: SubsocialApi }

export function useSubsocialQuery<ReturnValue, Data>(
  params: { key: string; data: Data | null },
  func: (params: SubsocialParam<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQuery(
    [params.key, params.data],
    queryWrapper<ReturnValue, Data, { api: SubsocialApi }>(func, async () => {
      const api = await getSubsocialApi()
      return { api }
    }),
    mergedConfig
  )
}

export function useSubsocialQueries<ReturnValue, Data>(
  params: { key: string; data: (Data | null)[] },
  func: (params: SubsocialParam<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQueries({
    queries: params.data.map((singleData) => {
      return {
        queryKey: [params.key, singleData],
        queryFn: queryWrapper<ReturnValue, Data, { api: SubsocialApi }>(
          func,
          async () => {
            const api = await getSubsocialApi()
            return { api }
          }
        ),
        ...mergedConfig,
      }
    }),
  })
}

export function useSubsocialMutation<Param>(
  getWallet: () => Promise<WalletAccount>,
  transactionGenerator: (
    params: Param,
    apis: {
      subsocialApi: SubsocialApi
      ipfsApi: SubsocialIpfsApi
      substrateApi: ApiPromise
    }
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: MutationConfig<Param>,
  defaultConfig?: MutationConfig<Param>
): UseMutationResult<string, Error, Param, unknown> {
  const workerFunc = async (param: Param) => {
    const wallet = await getWallet()
    console.log(wallet)
    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const ipfsApi = subsocialApi.ipfs
    return createTxAndSend(
      transactionGenerator,
      param,
      { subsocialApi, substrateApi, ipfsApi },
      { wallet, networkRpc: getConnectionConfig().substrateUrl },
      config,
      defaultConfig
    )
  }

  return useMutation(workerFunc, {
    ...(defaultConfig || {}),
    ...config,
    onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
    onError: makeCombinedCallback(defaultConfig, config, 'onError'),
  })
}

export function createSubsocialQuery<Params, ReturnValue>({
  key,
  getData,
}: {
  key: string
  getData: (params: SubsocialParam<Params>) => Promise<ReturnValue>
}) {
  return {
    getQueryKey: createQueryKeys<Params>(key),
    invalidate: createQueryInvalidation<Params>(key),
    useQuery: (data: Params, config?: QueryConfig<Params, any>) => {
      return useSubsocialQuery({ key, data }, getData, config)
    },
    useQueries: (data: Params[], config?: QueryConfig<Params, any>) => {
      return useSubsocialQueries({ key, data }, getData, config)
    },
  }
}
