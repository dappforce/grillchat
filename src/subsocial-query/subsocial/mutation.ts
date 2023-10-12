import { useTransactions } from '@/stores/transactions'
import { generatePromiseQueue } from '@/utils/promise'
import type { ApiPromise } from '@polkadot/api'
import type { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { getConnectionConfig, getGlobalTxCallbacks } from './config'
import { getSubstrateHttpApi } from './connection'
import {
  OptimisticData,
  SubsocialMutationConfig,
  Transaction,
  WalletAccount,
} from './types'
import { getBlockExplorerBlockInfoLink } from './utils'

type Apis = {
  subsocialApi: SubsocialApi
  ipfsApi: SubsocialIpfsApi
  substrateApi: ApiPromise
  useHttp: boolean
}

export function useSubsocialMutation<Data, Context = undefined>(
  getWallet: () => Promise<WalletAccount> | WalletAccount,
  transactionGenerator: (
    data: Data,
    apis: Apis
  ) => Promise<{ tx: Transaction; summary: string }>,
  config?: SubsocialMutationConfig<Data, Context>,
  defaultConfig?: SubsocialMutationConfig<Data, Context>
): UseMutationResult<string, Error, Data, unknown> {
  const workerFunc = async (data: Data) => {
    const wallet = await getWallet()
    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')

    const txCallbacks = generateTxCallbacks(
      {
        address: wallet.proxyToAddress || wallet.address,
        data,
      },
      config?.txCallbacks,
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    const { getSubsocialApi } = await import('./connection')
    const subsocialApi = await getSubsocialApi()
    const useHttp = config?.useHttp ?? defaultConfig?.useHttp
    let substrateApi: ApiPromise
    if (useHttp) {
      substrateApi = await getSubstrateHttpApi()
    } else {
      substrateApi = await subsocialApi.substrateApi
    }

    if (!substrateApi.isConnected) {
      // try reconnecting, if it fails, it will throw an error
      try {
        await substrateApi.disconnect()
        await substrateApi.connect()
      } catch (err) {
        throw new Error(`Failed to reconnect to the Substrate node: ${err}`)
      }
    }

    const ipfsApi = subsocialApi.ipfs

    try {
      return await createTxAndSend(
        transactionGenerator,
        data,
        { subsocialApi, substrateApi, ipfsApi, useHttp: !!useHttp },
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

async function createTxAndSend<Data>(
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
  const { tx, summary } = await transactionGenerator(data, apis)
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
function sendTransaction<Data>(
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
    wallet: { address, signer, proxyToAddress },
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

      let usedTx = tx
      if (proxyToAddress) {
        usedTx = apis.substrateApi.tx.proxy.proxy(proxyToAddress, null, tx)
      }

      // signer from talisman and signer from keyring are different
      // so they need to be handled differently, the one that have 'signPayload' are for talisman signer
      let account = signer
      let signerOpt = undefined
      if ('signPayload' in signer) {
        account = address
        signerOpt = signer
      }

      const txHashAndNonce = tx.toHex() + nonce
      if (!apis.useHttp) {
        useTransactions.getState().addPendingTransaction(txHashAndNonce)
      }

      // TODO: if the proxy call failed because of unauthorized, the proxy account needs to be removed
      const unsub = await usedTx.signAndSend(
        account,
        { nonce, signer: signerOpt },
        async (result) => {
          // the result is only tx hash if its using http connection
          if (typeof result.toHuman() === 'string') {
            return resolve(result.toString())
          }

          resolve(result?.txHash?.toString())
          if (result.status.isInvalid) {
            txCallbacks?.onError()
            globalTxCallbacks.onError({
              summary,
              address,
              data,
            })
          } else if (result.status.isBroadcast) {
            txCallbacks?.onBroadcast()
            globalTxCallbacks.onBroadcast({
              summary,
              data,
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
              useTransactions
                .getState()
                .removePendingTransaction(txHashAndNonce)
              txCallbacks?.onError()
              globalTxCallbacks.onError({
                error: result.dispatchError?.toString(),
                summary,
                address,
                data,
                explorerLink,
              })
            } else {
              useTransactions
                .getState()
                .removePendingTransaction(txHashAndNonce)
              txCallbacks?.onSuccess(result)
              globalTxCallbacks.onSuccess({
                explorerLink,
                summary,
                address,
                data,
              })
            }
            unsub()
          }
        }
      )
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

  return new Promise<{ nonce: number; nonceResolver: () => void }>(
    (resolve, reject) => {
      async function getNonce() {
        try {
          const timeoutId = setTimeout(() => {
            reject(
              new Error('Timeout: Cannot get nonce for the next transaction.')
            )
          }, 10_000)

          await previousQueue
          const nonce = await substrateApi.rpc.system.accountNextIndex(address)
          resolve({
            nonce: nonce.toNumber(),
            nonceResolver: noncePromise.resolveQueue,
          })

          clearTimeout(timeoutId)
        } catch (err) {
          console.log('Error getting nonce', err)
          reject(new Error('Failed to get nonce'))
        }
      }
      getNonce()
    }
  )
}

function generateTxCallbacks<Data, Context>(
  data: OptimisticData<Data>,
  callbacks: SubsocialMutationConfig<Data, Context>['txCallbacks'],
  defaultCallbacks: SubsocialMutationConfig<Data, Context>['txCallbacks']
) {
  if (!callbacks && !defaultCallbacks) return
  const { getContext } = defaultCallbacks || {}
  const context = getContext?.(data)
  return {
    onError: () =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onError'
      )(data, context),
    onBroadcast: () =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onBroadcast'
      )(data, context),
    onSuccess: (txResult: any) =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onSuccess')(
        data,
        context,
        txResult
      ),
    onSend: () =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onSend'
      )(data, context),
    onStart: () =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onStart'
      )(data, context),
  }
}
