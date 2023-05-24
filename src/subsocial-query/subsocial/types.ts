import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
}

export type OptimisticData<Data> = { data: Data; address: string }
export interface DefaultSubsocialMutationConfig<Data, Context>
  extends MutationConfig<Data> {
  txCallbacks?: {
    getContext: (data: OptimisticData<Data>) => Context
    onStart?: (data: OptimisticData<Data>, context: Context) => void
    onSend?: (data: OptimisticData<Data>, context: Context) => void
    onError?: (data: OptimisticData<Data>, context: Context) => void
    onSuccess?: (
      data: OptimisticData<Data>,
      context: Context,
      txResult: any
    ) => void
  }
}
