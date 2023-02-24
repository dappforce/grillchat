import { ApiPromise } from '@polkadot/api'
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

export type QueryConfig<T = any, V = any> = Omit<
  UseQueryOptions<T, unknown, T, (string | V | null)[]>,
  'queryFn' | 'queryKey'
>
export type MutationConfig<Param> = UseMutationOptions<
  string,
  Error,
  Param,
  unknown
> & { onTxSuccess?: (data: Param, address: string) => void }

export type Transaction = ReturnType<ApiPromise['tx']['']['']>

export interface WalletAccount {
  address: string
  signer?: any
}
