import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
}

export type OptimisticData<Param> = { params: Param; address: string }
export interface DefaultSubsocialMutationConfig<Params, Context>
  extends MutationConfig<Params> {
  txCallbacks?: {
    getContext: (data: OptimisticData<Params>) => Context
    onStart?: (param: OptimisticData<Params>, context: Context) => void
    onSend?: (param: OptimisticData<Params>, context: Context) => void
    onError?: (param: OptimisticData<Params>, context: Context) => void
    onSuccess?: (param: OptimisticData<Params>, context: Context) => void
  }
}
