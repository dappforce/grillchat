import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { makeCombinedCallback } from '../base'
import { getConnectionConfig } from './config'
import { CallbackData, TransactionMutationConfig, WalletAccount } from './types'

type TransactionGenerator<Data, Context, Return> = (params: {
  data: Data
  context: Context
  wallet: WalletAccount
}) => Promise<Return>
export function useTransactionMutation<
  Data,
  Context = undefined,
  Return = void
>(
  {
    getWallet,
    generateContext,
    transactionGenerator,
  }: {
    getWallet: () => Promise<WalletAccount> | WalletAccount
    generateContext: Context extends undefined
      ? undefined
      : (data: Data, wallet: WalletAccount) => Promise<Context> | Context
    transactionGenerator: TransactionGenerator<Data, Context, Return>
  },
  config?: TransactionMutationConfig<Data, Context, Return>,
  defaultConfig?: TransactionMutationConfig<Data, Context, Return>
): UseMutationResult<Return, Error, Data, unknown> {
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

    // TODO: use ipfs? or no
    // const ipfsApi = subsocialApi.ipfs

    const supressSendingTxError =
      config?.supressSendingTxError || defaultConfig?.supressSendingTxError
    return runTx(
      transactionGenerator,
      data,
      context,
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

async function runTx<Data, Context, Return>(
  transactionGenerator: TransactionGenerator<Data, Context, Return>,
  data: Data,
  context: Context,
  txConfig: {
    wallet: WalletAccount
    networkRpc?: string
    supressSendingTxError?: boolean
  },
  txCallbacks?: ReturnType<typeof generateTxCallbacks>
) {
  try {
    const txData = await transactionGenerator({
      data,
      wallet: txConfig.wallet,
      context,
    })
    txCallbacks?.onSuccess(txData)
    return txData
  } catch (err) {
    txCallbacks?.onError((err as any)?.message || 'Error generating tx', false)
    throw err
  }
}

export function generateTxCallbacks<Data, Context>(
  data: CallbackData<Data, Context>,
  callbacks: TransactionMutationConfig<Data, Context>['txCallbacks'],
  defaultCallbacks: TransactionMutationConfig<Data, Context>['txCallbacks']
) {
  if (!callbacks && !defaultCallbacks) return
  return {
    onError: (error: string, isAfterTxGenerated: boolean) =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onError')(
        data,
        error,
        isAfterTxGenerated
      ),
    onSuccess: (txResult: any) =>
      makeCombinedCallback(
        defaultCallbacks,
        callbacks,
        'onSuccess'
      )(data, txResult),
    onStart: () =>
      makeCombinedCallback(defaultCallbacks, callbacks, 'onStart')(data),
  }
}
