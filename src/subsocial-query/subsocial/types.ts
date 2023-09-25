import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
}

export type CallbackData<Data, Context> = {
  data: Data
  address: string
  context: Context
}
export interface SubsocialMutationConfig<Data, Context = undefined>
  extends MutationConfig<Data> {
  txCallbacks?: {
    onStart?: (data: CallbackData<Data, Context>) => void
    onError?: (data: CallbackData<Data, Context>) => void
    onBeforeSend?: (data: CallbackData<Data, Context>, txSig: string) => void
    onSuccess?: (data: CallbackData<Data, Context>) => void
  }
}
