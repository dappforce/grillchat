import { getCurrentWallet } from '@/old/services/subsocial/hooks'
import { useConnectWallet } from '@/providers/ConnectWalletProvider'
import { useMyAccount } from '@/stores/my-account'
import { useTransactions } from '@/stores/transactions'
import { generatePromiseQueue } from '@/utils/promise'
import type { ApiPromise } from '@polkadot/api'
import type { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { getConnectionConfig, getGlobalTxCallbacks } from './config'
import { getSubstrateHttpApi } from './connection'
import {
  CallbackData,
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

type TransactionGenerator<Data, Context> = (params: {
  data: Data
  context: Context
  apis: Apis
  wallet: WalletAccount
}) => Promise<{ tx: Transaction; summary: string }>
export function useSubsocialMutation<Data, Context = undefined>(
  {
    generateContext,
    transactionGenerator,
    walletType = 'grill',
  }: {
    walletType?: 'grill' | 'injected' | 'dynamic'
    generateContext: Context extends undefined
      ? undefined
      : (data: Data, wallet: WalletAccount) => Promise<Context> | Context
    transactionGenerator: TransactionGenerator<Data, Context>
  },
  config?: SubsocialMutationConfig<Data, Context>,
  defaultConfig?: SubsocialMutationConfig<Data, Context>
): UseMutationResult<string, Error, Data, unknown> {
  const { requestWalletAccount } = useConnectWallet()

  const workerFunc = async (data: Data) => {
    const parentProxyAddress = useMyAccount.getState().parentProxyAddress
    let wallet = getCurrentWallet(
      (walletType === 'dynamic' && parentProxyAddress) ||
        walletType === 'injected'
        ? 'injected'
        : 'grill'
    )

    if (walletType === 'dynamic' && parentProxyAddress && !wallet.signer) {
      const connected = await requestWalletAccount()
      if (!connected) {
        throw new Error(
          'Cannot connect to your polkadot wallet, please make sure you have your connected account inside your selected wallet'
        )
      }
      wallet = connected
    }

    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')

    const context = (await generateContext?.(data, wallet)) as Context

    const txCallbacks = generateTxCallbacks(
      {
        address: wallet.proxyToAddress || wallet.address,
        data,
        context,
      },
      config?.txCallbacks,
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    const { getSubsocialApi } = await import('./connection')

    const subsocialApi = await getSubsocialApi()
    const useHttp = config?.useHttp || defaultConfig?.useHttp
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

    const supressSendingTxError =
      config?.supressSendingTxError || defaultConfig?.supressSendingTxError
    return createTxAndSend(
      transactionGenerator,
      data,
      context,
      { subsocialApi, substrateApi, ipfsApi, useHttp: !!useHttp },
      {
        wallet,
        networkRpc: getConnectionConfig().substrateUrl,
        supressSendingTxError,
      },
      txCallbacks
    )
  }

  return useMutation(workerFunc, {
    ...(defaultConfig || {}),
    ...config,
    onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
    onError: makeCombinedCallback(defaultConfig, config, 'onError'),
  })
}

async function createTxAndSend<Data, Context>(
  transactionGenerator: TransactionGenerator<Data, Context>,
  data: Data,
  context: Context,
  apis: Apis,
  txConfig: {
    wallet: WalletAccount
    networkRpc?: string
    supressSendingTxError?: boolean
  },
  txCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  let tx: Transaction
  let summary: string
  try {
    const txData = await transactionGenerator({
      data,
      apis,
      wallet: txConfig.wallet,
      context,
    })
    tx = txData.tx
    summary = txData.summary
  } catch (err) {
    txCallbacks?.onError((err as any)?.message || 'Error generating tx', false)
    throw err
  }
  try {
    return await sendTransaction(
      {
        tx,
        wallet: txConfig.wallet,
        data,
        networkRpc: txConfig.networkRpc,
        summary,
      },
      apis.substrateApi,
      txCallbacks,
      apis.useHttp
    )
  } catch (err) {
    txCallbacks?.onError((err as any)?.message || 'Error generating tx', true)
    if (txConfig.supressSendingTxError) {
      console.warn('Error supressed:', err)
      return ''
    }
    throw err
  }
}
export function sendTransaction<Data>(
  txInfo: {
    tx: Transaction
    summary: string
    wallet: WalletAccount
    data: Data
    networkRpc: string | undefined
  },
  substrateApi: ApiPromise,
  txCallbacks?: ReturnType<typeof generateTxCallbacks>,
  useHttp?: boolean
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
      const { nonce, nonceResolver } = await getNonce(substrateApi, address)
      danglingNonceResolver = nonceResolver

      let usedTx = tx
      if (proxyToAddress) {
        usedTx = substrateApi.tx.proxy.proxy(proxyToAddress, null, tx)
      }

      // signer from talisman and signer from keyring are different
      // so they need to be handled differently, the one that have 'signPayload' are for talisman signer
      let account = signer
      let usedSigner = undefined
      if ('signPayload' in signer) {
        account = address
        usedSigner = signer
      }

      const txHashAndNonce = usedTx.toHex() + nonce
      if (!useHttp) {
        useTransactions.getState().addPendingTransaction(txHashAndNonce)
      }

      const unsub = await usedTx.signAndSend(
        account,
        { nonce, signer: usedSigner },
        async (result) => {
          // the result is only tx hash if its using http connection
          if (typeof result.toHuman() === 'string') {
            return resolve(result.toString())
          }

          resolve(result.txHash.toString())
          if (result.status.isInvalid) {
            txCallbacks?.onError('Transaction is invalid', true)
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
            useTransactions.getState().removePendingTransaction(txHashAndNonce)
            if (
              result.isError ||
              result.dispatchError ||
              result.internalError
            ) {
              const error = result.dispatchError?.toString()
              txCallbacks?.onError(
                error || 'Error when executing transaction',
                true
              )
              globalTxCallbacks.onError({
                error,
                summary,
                address,
                data,
                explorerLink,
              })
            } else {
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
      globalTxCallbacks.onSend({ summary, address, data })
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
          console.error('Error getting nonce', err)
          reject(new Error('Failed to get nonce'))
        }
      }
      getNonce()
    }
  )
}

export function generateTxCallbacks<Data, Context>(
  data: CallbackData<Data, Context>,
  callbacks: SubsocialMutationConfig<Data, Context>['txCallbacks'],
  defaultCallbacks: SubsocialMutationConfig<Data, Context>['txCallbacks']
) {
  if (!callbacks && !defaultCallbacks) return
  return {
    onError: (error: string, isAfterTxGenerated: boolean) =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onError')(
        data,
        error,
        isAfterTxGenerated
      ),
    onBroadcast: () =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onBroadcast')(data),
    onSuccess: (txResult: any) =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onSuccess'
      )(data, txResult),
    onSend: () =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onSend')(data),
    onStart: () =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onStart')(data),
  }
}
