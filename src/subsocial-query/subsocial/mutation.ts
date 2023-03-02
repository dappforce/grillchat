import type { ApiPromise } from '@polkadot/api'
import { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { MutationConfig } from '../types'
import { getConnectionConfig, getGlobalTxCallbacks } from './config'
import { getSubsocialApi } from './connection'
import {
  DefaultSubsocialMutationConfig,
  OptimisticData,
  Transaction,
  WalletAccount,
} from './types'
import { getBlockExplorerBlockInfoLink } from './utils'

export function useSubsocialMutation<Param, Context>(
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
  defaultConfig?: DefaultSubsocialMutationConfig<Param, Context>
): UseMutationResult<string, Error, Param, unknown> {
  const workerFunc = async (param: Param) => {
    const wallet = await getWallet()
    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')

    const txCallbacks = generateTxCallbacks(
      {
        address: wallet.address,
        param,
      },
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const ipfsApi = subsocialApi.ipfs
    try {
      return await createTxAndSend(
        transactionGenerator,
        param,
        { subsocialApi, substrateApi, ipfsApi },
        { wallet, networkRpc: getConnectionConfig().substrateUrl },
        config,
        defaultConfig,
        txCallbacks
      )
    } catch (e) {
      txCallbacks?.onError()
      throw e
    }
  }

  return useMutation(workerFunc, {
    ...(defaultConfig || {}),
    ...config,
    onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
    onError: makeCombinedCallback(defaultConfig, config, 'onError'),
  })
}

async function createTxAndSend<Param, AdditionalParams, Context>(
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
  defaultConfig?: DefaultSubsocialMutationConfig<Param, Context>,
  optimisticCallbacks?: ReturnType<typeof generateTxCallbacks>
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
    defaultConfig,
    optimisticCallbacks
  )
}
function sendTransaction<Param, Context>(
  txInfo: {
    tx: Transaction
    summary: string
    wallet: WalletAccount
    params: Param
    networkRpc: string | undefined
  },
  config?: MutationConfig<Param>,
  defaultConfig?: DefaultSubsocialMutationConfig<Param, Context>,
  txCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  const {
    networkRpc,
    params,
    summary,
    tx,
    wallet: { address, signer },
  } = txInfo
  const globalTxCallbacks = getGlobalTxCallbacks()
  return new Promise<string>(async (resolve, reject) => {
    try {
      const unsub = await tx.signAndSend(
        signer,
        { nonce: -1 },
        async (result) => {
          resolve(result.txHash.toString())
          if (result.status.isBroadcast) {
            globalTxCallbacks.onBroadcast({
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
              txCallbacks?.onError()
              globalTxCallbacks.onError({
                error: result.dispatchError?.toString(),
                summary,
                address,
                params,
                explorerLink,
              })
            } else {
              txCallbacks?.onSuccess()
              const onTxSuccess = makeCombinedCallback(
                defaultConfig,
                config,
                'onTxSuccess'
              )
              onTxSuccess({ params, address, result })
              globalTxCallbacks.onSuccess({
                explorerLink,
                summary,
                address,
                params,
              })
            }
            unsub()
          }
        }
      )
      txCallbacks?.onSend()
    } catch (e) {
      globalTxCallbacks.onError((e as any).message)
      reject((e as any).message)
    }
  })
}

function generateTxCallbacks<Param, Context>(
  data: OptimisticData<Param>,
  callbacks: DefaultSubsocialMutationConfig<Param, Context>['txCallbacks']
) {
  if (!callbacks) return
  const { onError, onSuccess, onSend, onStart, getContext } = callbacks
  const context = getContext(data)
  return {
    onError: () => onError?.(data, context),
    onSuccess: () => onSuccess?.(data, context),
    onSend: () => onSend?.(data, context),
    onStart: () => onStart?.(data, context),
  }
}
