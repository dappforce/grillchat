import { generatePromiseQueue } from '@/utils/promise'
import type { ApiPromise } from '@polkadot/api'
import type { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { MutationConfig } from '../types'
import { getConnectionConfig, getGlobalTxCallbacks } from './config'
import {
  DefaultSubsocialMutationConfig,
  OptimisticData,
  Transaction,
  WalletAccount,
} from './types'
import { getBlockExplorerBlockInfoLink } from './utils'

type Apis = {
  subsocialApi: SubsocialApi
  ipfsApi: SubsocialIpfsApi
  substrateApi: ApiPromise
}

export function useSubsocialMutation<Params, Context>(
  getWallet: () => Promise<WalletAccount>,
  transactionGenerator: (
    params: Params,
    apis: Apis
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: MutationConfig<Params>,
  defaultConfig?: DefaultSubsocialMutationConfig<Params, Context>
): UseMutationResult<string, Error, Params, unknown> {
  const workerFunc = async (params: Params) => {
    const wallet = await getWallet()
    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')

    const txCallbacks = generateTxCallbacks(
      {
        address: wallet.address,
        params,
      },
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    const { getSubsocialApi } = await import('./connection')
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const ipfsApi = subsocialApi.ipfs
    try {
      return await createTxAndSend(
        transactionGenerator,
        params,
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

async function createTxAndSend<Params, Context>(
  transactionGenerator: (
    params: Params,
    apis: Apis
  ) => Promise<{ tx: Transaction; summary: string }>,
  param: Params,
  apis: Apis,
  txConfig: {
    wallet: WalletAccount
    networkRpc?: string
  },
  config?: MutationConfig<Params>,
  defaultConfig?: DefaultSubsocialMutationConfig<Params, Context>,
  optimisticCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  const { tx, summary } = await transactionGenerator(param, apis)
  return sendTransaction(
    {
      tx,
      wallet: txConfig.wallet,
      params: param,
      networkRpc: txConfig.networkRpc,
      summary,
    },
    apis,
    config,
    defaultConfig,
    optimisticCallbacks
  )
}
function sendTransaction<Params, Context>(
  txInfo: {
    tx: Transaction
    summary: string
    wallet: WalletAccount
    params: Params
    networkRpc: string | undefined
  },
  apis: Apis,
  config?: MutationConfig<Params>,
  defaultConfig?: DefaultSubsocialMutationConfig<Params, Context>,
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
    let danglingNonceResolver: undefined | (() => void)
    try {
      const { nonce, nonceResolver } = await getNonce(
        apis.substrateApi,
        address
      )
      danglingNonceResolver = nonceResolver
      const unsub = await tx.signAndSend(signer, { nonce }, async (result) => {
        resolve(result.txHash.toString())
        if (result.status.isInvalid) {
          txCallbacks?.onError()
          globalTxCallbacks.onError({
            summary,
            address,
            params,
          })
        } else if (result.status.isBroadcast) {
          globalTxCallbacks.onBroadcast({
            summary,
            params,
            address,
          })
        } else if (result.status.isInBlock) {
          const blockHash = (result.status.toJSON() ?? ({} as any)).inBlock
          let explorerLink: string | undefined
          if (networkRpc) {
            explorerLink = getBlockExplorerBlockInfoLink(networkRpc, blockHash)
          }
          if (result.isError || result.dispatchError || result.internalError) {
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
      })
      nonceResolver()
      txCallbacks?.onSend()
    } catch (e) {
      danglingNonceResolver?.()
      reject(e)
    }
  })
}

const noncePromise = generatePromiseQueue()
/**
 * This function is used to get nonce for the next transaction, and wait until the previous transaction is sent.
 * You need to call `nonceResolver()` after you send the transaction.
 * @param substrateApi Substrate API
 * @param address Address of the account
 */
async function getNonce(substrateApi: ApiPromise, address: string) {
  const previousQueue = noncePromise.addQueue()
  await previousQueue
  const nonce = await substrateApi.rpc.system.accountNextIndex(address)
  return { nonce, nonceResolver: noncePromise.resolveQueue }
}

function generateTxCallbacks<Params, Context>(
  data: OptimisticData<Params>,
  callbacks: DefaultSubsocialMutationConfig<Params, Context>['txCallbacks']
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
