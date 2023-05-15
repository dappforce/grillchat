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

export function useSubsocialMutation<Data, Context>(
  getWallet: () => Promise<WalletAccount>,
  transactionGenerator: (
    data: Data,
    apis: Apis
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: MutationConfig<Data>,
  defaultConfig?: DefaultSubsocialMutationConfig<Data, Context>
): UseMutationResult<string, Error, Data, unknown> {
  const workerFunc = async (data: Data) => {
    const wallet = await getWallet()
    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')

    const txCallbacks = generateTxCallbacks(
      {
        address: wallet.address,
        data,
      },
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    const { getSubsocialApi } = await import('./connection')
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const ipfsApi = subsocialApi.ipfs

    console.log('hello')

    try {
      return await createTxAndSend(
        transactionGenerator,
        data,
        { subsocialApi, substrateApi, ipfsApi },
        { wallet, networkRpc: getConnectionConfig().substrateUrl },
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

async function createTxAndSend<Data, Context>(
  transactionGenerator: (
    data: Data,
    apis: Apis
  ) => Promise<{ tx: Transaction; summary: string }>,
  data: Data,
  apis: Apis,
  txConfig: {
    wallet: WalletAccount
    networkRpc?: string
  },
  optimisticCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  console.log('before transactionGenerator func')
  
  const { tx, summary } = await transactionGenerator(data, apis)
  console.log('before send tx func')
  return sendTransaction(
    {
      tx,
      wallet: txConfig.wallet,
      data,
      networkRpc: txConfig.networkRpc,
      summary,
    },
    apis,
    optimisticCallbacks
  )
}
function sendTransaction<Data, Context>(
  txInfo: {
    tx: Transaction
    summary: string
    wallet: WalletAccount
    data: Data
    networkRpc: string | undefined
  },
  apis: Apis,
  txCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  const {
    networkRpc,
    data,
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
            data,
          })
        } else if (result.status.isBroadcast) {
          globalTxCallbacks.onBroadcast({
            summary,
            data,
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
              data,
              explorerLink,
            })
          } else {
            txCallbacks?.onSuccess()
            globalTxCallbacks.onSuccess({
              explorerLink,
              summary,
              address,
              data,
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

function generateTxCallbacks<Data, Context>(
  data: OptimisticData<Data>,
  callbacks: DefaultSubsocialMutationConfig<Data, Context>['txCallbacks']
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
