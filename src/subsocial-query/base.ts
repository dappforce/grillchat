import { QueryClient, UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  MutationConfig,
  QueryConfig,
  Transaction,
  WalletAccount,
} from './types'
import { getBlockExplorerBlockInfoLink } from './utils'

export function queryWrapper<ReturnType, Data, AdditionalData>(
  func: (params: { data: Data } & AdditionalData) => Promise<ReturnType>,
  getAdditionalData: () => Promise<AdditionalData>
) {
  return async ({ queryKey }: any) => {
    const data = queryKey[1]
    const additionalData = await getAdditionalData()
    return func({ ...additionalData, data })
  }
}

export function useIsAnyQueriesLoading(results: UseQueryResult[]) {
  return useMemo(() => {
    return results.some(({ isLoading }) => isLoading)
  }, [results])
}

export function mergeQueryConfig<T, V>(
  config?: QueryConfig<any, any>,
  defaultConfig?: QueryConfig<T, V>
): QueryConfig<T, V> {
  return {
    ...defaultConfig,
    ...config,
    enabled: (defaultConfig?.enabled ?? true) && (config?.enabled ?? true),
  }
}

export function createQueryKeys<Param>(key: string) {
  return (data: Param | null = null) => {
    return [key, data]
  }
}

export function createQueryInvalidation<Param>(key: string) {
  return (client: QueryClient, data: Param | null = null, exact = false) => {
    client.invalidateQueries({
      queryKey: [key, data],
      exact,
    })
  }
}

export function makeCombinedCallback(
  defaultConfig: any,
  config: any,
  attr: string
) {
  return (...data: any[]) => {
    defaultConfig && defaultConfig[attr] && defaultConfig[attr](...data)
    config && config[attr] && config[attr](...data)
  }
}

export interface TxCallbacksParams {
  summary: string
  address: string
  params: any
  explorerLink?: string
  error?: string
}
const DEFAULT_TX_CALLBACKS = {
  onBroadcast: ({ summary }: TxCallbacksParams) =>
    console.info(`Broadcasting ${summary}...`),
  onError: ({ error }: TxCallbacksParams) => console.error(error),
  onSuccess: ({ summary }: TxCallbacksParams) =>
    console.log(`Success submit ${summary}...`),
}
let txCallbacks = DEFAULT_TX_CALLBACKS
export const setupTxCallbacks = (callbacks: Partial<typeof txCallbacks>) => {
  txCallbacks = { ...DEFAULT_TX_CALLBACKS, ...callbacks }
}

export async function createTxAndSend<Param, AdditionalParams>(
  transactionGenerator: (
    param: Param,
    additionalParams: AdditionalParams
  ) => Promise<{ tx: Transaction; summary: string }>,
  param: Param,
  additionalParams: AdditionalParams,
  txConfig: {
    wallet: WalletAccount
    networkRpc?: string
  },
  config?: MutationConfig<Param>,
  defaultConfig?: MutationConfig<Param>
) {
  const { tx, summary } = await transactionGenerator(param, additionalParams)
  return sendTransaction(
    {
      tx,
      wallet: txConfig.wallet,
      params: param,
      networkRpc: txConfig.networkRpc,
      summary,
    },
    config,
    defaultConfig
  )
}
export function sendTransaction<Param>(
  txInfo: {
    tx: Transaction
    summary: string
    wallet: WalletAccount
    params: Param
    networkRpc: string | undefined
  },
  config?: MutationConfig<Param>,
  defaultConfig?: MutationConfig<Param>
) {
  const {
    networkRpc,
    params,
    summary,
    tx,
    wallet: { address, signer },
  } = txInfo
  return new Promise<string>(async (resolve, reject) => {
    try {
      const unsub = await tx.signAndSend(
        address,
        {
          signer,
        },
        async (result) => {
          resolve(result.txHash.toString())
          if (result.status.isBroadcast) {
            txCallbacks.onBroadcast({
              summary,
              params: params,
              address,
            })
          } else if (result.status.isInBlock) {
            const blockHash = (result.status.toJSON() ?? ({} as any)).inBlock
            let explorerLink: string | undefined
            if (networkRpc) {
              explorerLink = getBlockExplorerBlockInfoLink(
                networkRpc,
                blockHash
              )
            }
            if (
              result.isError ||
              result.dispatchError ||
              result.internalError
            ) {
              txCallbacks.onError({
                error: result.dispatchError?.toString(),
                summary,
                address,
                params,
                explorerLink,
              })
            } else {
              const onTxSuccess = makeCombinedCallback(
                defaultConfig,
                config,
                'onTxSuccess'
              )
              onTxSuccess(params, address)
              txCallbacks.onSuccess({ explorerLink, summary, address, params })
            }
            unsub()
          }
        }
      )
    } catch (e) {
      txCallbacks.onError((e as any).message)
      reject(e)
    }
  })
}
