import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
}

export type OptimisticData<Param> = { param: Param; address: string }
export interface DefaultSubsocialMutationConfig<Param, Context>
  extends MutationConfig<Param> {
  txCallbacks?: {
    getContext: (data: OptimisticData<Param>) => Context
    onStart?: (param: OptimisticData<Param>, context: Context) => void
    onSend?: (param: OptimisticData<Param>, context: Context) => void
    onError?: (param: OptimisticData<Param>, context: Context) => void
    onSuccess?: (param: OptimisticData<Param>, context: Context) => void
  }
}
