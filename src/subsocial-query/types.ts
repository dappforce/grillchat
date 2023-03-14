import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

export type QueryConfig<ReturnValue = any, Params = any> = Omit<
  UseQueryOptions<
    ReturnValue,
    unknown,
    ReturnValue,
    (string | Params | null)[]
  >,
  'queryFn' | 'queryKey'
>
export type MutationConfig<Param> = UseMutationOptions<
  string,
  Error,
  Param,
  unknown
>
