import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

export type QueryConfig<Data = any, ReturnValue = any> = Omit<
  UseQueryOptions<ReturnValue, unknown, ReturnValue, (string | Data)[]>,
  'queryFn' | 'queryKey'
>
export type MutationConfig<Data> = UseMutationOptions<
  string,
  Error,
  Data,
  unknown
>
