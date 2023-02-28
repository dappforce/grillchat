import {
  MutationFunction,
  QueryClient,
  useMutation,
  UseMutationOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useMemo } from 'react'
import { QueryConfig } from './types'

export function queryWrapper<ReturnType, Data, AdditionalData>(
  func: (params: { data: Data } & AdditionalData) => Promise<ReturnType>,
  getAdditionalData: () => Promise<AdditionalData>
) {
  return async ({ queryKey }: any) => {
    const data = queryKey[1]
    const additionalData = await getAdditionalData()
    return func({ ...additionalData, data })
  }
}

export function useIsAnyQueriesLoading(results: UseQueryResult[]) {
  return useMemo(() => {
    return results.some(({ isLoading }) => isLoading)
  }, [results])
}

export function mergeQueryConfig<T, V>(
  config?: QueryConfig<any, any>,
  defaultConfig?: QueryConfig<T, V>
): QueryConfig<T, V> {
  return {
    ...defaultConfig,
    ...config,
    enabled: (defaultConfig?.enabled ?? true) && (config?.enabled ?? true),
  }
}

export function createQueryKeys<Param>(key: string) {
  return (data: Param) => {
    return [key, data]
  }
}

export function createQueryInvalidation<Param>(key: string) {
  return (client: QueryClient, data: Param | null = null, exact = false) => {
    client.invalidateQueries({
      queryKey: [key, data],
      exact,
    })
  }
}

export function makeCombinedCallback(
  defaultConfig: any,
  config: any,
  attr: string
) {
  return (...data: any[]) => {
    defaultConfig && defaultConfig[attr] && defaultConfig[attr](...data)
    config && config[attr] && config[attr](...data)
  }
}

export default function mutationWrapper<ReturnData, Data>(
  func: MutationFunction<ReturnData, Data>,
  defaultConfig?: UseMutationOptions<ReturnData, unknown, Data, unknown>
) {
  return function (
    config?: UseMutationOptions<ReturnData, unknown, Data, unknown>
  ) {
    return useMutation(func, {
      ...(defaultConfig || {}),
      ...config,
      onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
      onError: makeCombinedCallback(defaultConfig, config, 'onError'),
    })
  }
}
