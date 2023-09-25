import { generatePromiseQueue } from '@/utils/promise'
import type { ApiPromise } from '@polkadot/api'
import type { SubsocialApi, SubsocialIpfsApi } from '@subsocial/api'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { getConnectionConfig, getGlobalTxCallbacks } from './config'
import {
  CallbackData,
  SubsocialMutationConfig,
  Transaction,
  WalletAccount,
} from './types'

type Apis = {
  subsocialApi: SubsocialApi
  ipfsApi: SubsocialIpfsApi
  substrateApi: ApiPromise
}

type TransactionGenerator<Data, Context> = (params: {
  data: Data
  context: Context
  apis: Apis
  wallet: WalletAccount
}) => Promise<{ tx: Transaction; summary: string }>
export function useSubsocialMutation<Data, Context = undefined>(
  {
    getWallet,
    generateContext,
    transactionGenerator,
  }: {
    getWallet: () => Promise<WalletAccount> | WalletAccount
    generateContext: Context extends undefined
      ? undefined
      : (data: Data, wallet: WalletAccount) => Promise<Context> | Context
    transactionGenerator: TransactionGenerator<Data, Context>
  },
  config?: SubsocialMutationConfig<Data, Context>,
  defaultConfig?: SubsocialMutationConfig<Data, Context>
): UseMutationResult<string, Error, Data, unknown> {
  const workerFunc = async (data: Data) => {
    const wallet = await getWallet()
    if (!wallet.address || !wallet.signer)
      throw new Error('You need to connect your wallet first!')

    const context = (await generateContext?.(data, wallet)) as Context

    const txCallbacks = generateTxCallbacks(
      {
        address: wallet.address,
        data,
        context,
      },
      config?.txCallbacks,
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    const { getSubsocialApi } = await import('./connection')
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi

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

    return await createTxAndSend(
      transactionGenerator,
      data,
      context,
      { subsocialApi, substrateApi, ipfsApi },
      { wallet, networkRpc: getConnectionConfig().substrateUrl },
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
  },
  optimisticCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  const { tx, summary } = await transactionGenerator({
    data,
    apis,
    wallet: txConfig.wallet,
    context,
  })
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

      const signature = await tx.signAsync(signer, { nonce })
      const txSig = signature.toHex()

      globalTxCallbacks.onBeforeSend({ summary, address, data })
      txCallbacks?.onBeforeSend(txSig)

      const hash = await signature.send()
      nonceResolver()

      txCallbacks?.onSuccess(hash.toHex())
      globalTxCallbacks.onSuccess({
        summary,
        address,
        data,
      })
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
  data: CallbackData<Data, Context>,
  callbacks: SubsocialMutationConfig<Data, Context>['txCallbacks'],
  defaultCallbacks: SubsocialMutationConfig<Data, Context>['txCallbacks']
) {
  if (!callbacks && !defaultCallbacks) return
  return {
    onSuccess: (txHash: string) =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onSuccess'
      )(data, txHash),
    onBeforeSend: (txSig: string) =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onBeforeSend'
      )(data, txSig),
    onStart: () =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onStart')(data),
  }
}
