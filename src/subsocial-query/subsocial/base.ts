import { SubsocialApi } from '@subsocial/api'
import {
  useMutation,
  UseMutationResult,
  useQueries,
  useQuery,
} from '@tanstack/react-query'
import {
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
import { getConnectionConfig, getSubsocialApi } from './connection'

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
    api: SubsocialApi
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: MutationConfig<Param>,
  defaultConfig?: MutationConfig<Param>
): UseMutationResult<string, Error, Param, unknown> {
  const workerFunc = async (param: Param) => {
    const wallet = await getWallet()
    if (!wallet) throw new Error('You need to connect your wallet first!')
    const subsocialApi = await getSubsocialApi()
    return createTxAndSend(
      transactionGenerator,
      param,
      subsocialApi,
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
