import type { ApiPromise } from '@polkadot/api'
import { MutationConfig } from '../types'

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
  proxyToAddress?: string
}

export type OptimisticData<Data> = { data: Data; address: string }
export interface SubsocialMutationConfig<Data, Context = undefined>
  extends MutationConfig<Data> {
  useHttp?: boolean
  txCallbacks?: {
    getContext?: (data: OptimisticData<Data>) => Context
    onStart?: (data: OptimisticData<Data>, context: Context) => void
    onSend?: (data: OptimisticData<Data>, context: Context) => void
    onBroadcast?: (data: OptimisticData<Data>, context: Context) => void
    onError?: (data: OptimisticData<Data>, context: Context) => void
    onSuccess?: (
      data: OptimisticData<Data>,
      context: Context,
      txResult: any
    ) => void
  }
}
