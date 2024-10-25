import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer: any | null
  proxyToAddress?: string
}

export type CallbackData<Data, Context> = {
  data: Data
  address: string
  context: Context
}
export interface SubsocialMutationConfig<Data, Context = undefined>
  extends MutationConfig<Data> {
  useHttp?: boolean
  supressSendingTxError?: boolean
  txCallbacks?: {
    onStart?: (data: CallbackData<Data, Context>) => void
    onSend?: (data: CallbackData<Data, Context>) => void
    onBroadcast?: (data: CallbackData<Data, Context>) => void
    onError?: (
      data: CallbackData<Data, Context>,
      error: string,
      isAfterTxGenerated: boolean
    ) => void
    onSuccess?: (data: CallbackData<Data, Context>, txResult: any) => void
  }
}
