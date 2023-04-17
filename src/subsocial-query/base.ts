import {
  MutationFunction,
  QueryClient,
  Updater,
  useMutation,
  UseMutationOptions,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import { useMemo } from 'react'
import { QueryConfig } from './types'

export function queryWrapper<ReturnType, Data, AdditionalData>(
  func: (params: { data: Data } & AdditionalData) => Promise<ReturnType>,
  getAdditionalData: () => Promise<AdditionalData>
) {
  return async ({ queryKey }: { queryKey: any }) => {
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

export function createQuery<Params, ReturnValue>({
  key,
  getData,
}: {
  key: string
  getData: (params: Params) => Promise<ReturnValue>
}) {
  const getQueryKey = createQueryKeys<Params>(key)
  return {
    getQueryKey,
    invalidate: createQueryInvalidation<Params>(key),
    useQuery: (
      data: Params | null,
      config?: QueryConfig<ReturnValue, Params>,
      defaultConfig?: QueryConfig<ReturnValue, Params>
    ) => {
      const mergedConfig = mergeQueryConfig(config, defaultConfig)
      return useQuery(
        [key, data],
        queryWrapper<ReturnValue, Params, void>(
          ({ data }) => getData(data),
          async () => undefined
        ),
        mergedConfig
      )
    },
    useQueries: (
      data: (Params | null)[],
      config?: QueryConfig<ReturnValue, Params>,
      defaultConfig?: QueryConfig<ReturnValue, Params>
    ) => {
      const mergedConfig = mergeQueryConfig(config, defaultConfig)
      return useQueries({
        queries: data.map((singleData) => {
          return {
            queryKey: [key, singleData],
            queryFn: queryWrapper<ReturnValue, Params, void>(
              ({ data }) => getData(data),
              async () => undefined
            ),
            ...mergedConfig,
          }
        }),
      })
    },
    setQueryData: (
      client: QueryClient,
      data: Params,
      value: Updater<ReturnValue | undefined, ReturnValue | undefined>
    ) => {
      client.setQueryData(getQueryKey(data), value)
    },
    getQueryData: (
      client: QueryClient,
      data: Params
    ): ReturnValue | undefined => {
      return client.getQueryData(getQueryKey(data))
    },
  }
}
