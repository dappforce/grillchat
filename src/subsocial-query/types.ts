import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

export type QueryConfig<ReturnValue = any, Data = any> = Omit<
  UseQueryOptions<ReturnValue, unknown, ReturnValue, (string | Data | null)[]>,
  'queryFn' | 'queryKey'
>
export type MutationConfig<Data> = UseMutationOptions<
  string,
  Error,
  Data,
  unknown
>
