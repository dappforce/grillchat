import type { ApiPromise } from '@polkadot/api'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { getConnectionConfig } from './config'
import { getSubstrateChainApi } from './connection'
import { generateTxCallbacks, sendTransaction } from './mutation'
import { SubsocialMutationConfig, Transaction, WalletAccount } from './types'

type LazyApis = {
  substrateApi: ApiPromise
}

type TransactionGenerator<Data, Context> = (params: {
  data: Data
  context: Context
  apis: LazyApis
  wallet: WalletAccount
}) => Promise<{ tx: Transaction; summary: string }>
export function useLazeSubstrateMutation<Data, Context = undefined>(
  {
    getWallet,
    chainEndpoint,
    generateContext,
    transactionGenerator,
  }: {
    getWallet: () => Promise<WalletAccount> | WalletAccount
    chainEndpoint: string
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
        address: wallet.proxyToAddress || wallet.address,
        data,
        context,
      },
      config?.txCallbacks,
      defaultConfig?.txCallbacks
    )
    txCallbacks?.onStart()

    let substrateApi: ApiPromise = await getSubstrateChainApi(chainEndpoint)

    if (!substrateApi.isConnected) {
      // try reconnecting, if it fails, it will throw an error
      try {
        await substrateApi.disconnect()
        await substrateApi.connect()
      } catch (err) {
        throw new Error(`Failed to reconnect to the Substrate node: ${err}`)
      }
    }

    const supressSendingTxError =
      config?.supressSendingTxError || defaultConfig?.supressSendingTxError
    return createTxAndSend(
      transactionGenerator,
      data,
      context,
      { substrateApi },
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
  apis: LazyApis,
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
      txCallbacks
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
