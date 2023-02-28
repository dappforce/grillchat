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
>
