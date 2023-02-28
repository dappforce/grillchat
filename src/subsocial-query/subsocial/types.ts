import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
}

type OptimisticData<Param> = { param: Param; address: string }
export interface DefaultSubsocialMutationConfig<Param>
  extends MutationConfig<Param> {
  optimistic?: {
    getTempId: (data: OptimisticData<Param>) => string
    addData: (param: OptimisticData<Param>) => any
    removeData: (param: OptimisticData<Param>) => any
  }
}
