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

export function queryWrapper<ReturnValue, Data, AdditionalData>(
  func: (queryData: { data: Data } & AdditionalData) => Promise<ReturnValue>,
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

export function createQueryKeys<Data>(key: string) {
  return (data: Data) => {
    return [key, data]
  }
}

export function createQueryInvalidation<Data>(key: string) {
  return async (
    client: QueryClient,
    data: Data | null = null,
    exact = false
  ) => {
    return client.invalidateQueries({
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
    defaultConfig?.[attr]?.(...data)
    config?.[attr]?.(...data)
  }
}

export default function mutationWrapper<ReturnValue, Data>(
  func: MutationFunction<ReturnValue, Data>,
  defaultConfig?: UseMutationOptions<ReturnValue, unknown, Data, unknown>
) {
  return function (
    config?: UseMutationOptions<ReturnValue, unknown, Data, unknown>
  ) {
    return useMutation(func, {
      ...(defaultConfig || {}),
      ...config,
      onSuccess: makeCombinedCallback(defaultConfig, config, 'onSuccess'),
      onError: makeCombinedCallback(defaultConfig, config, 'onError'),
    })
  }
}

export function createQuery<Data, ReturnValue>({
  key,
  fetcher,
  defaultConfigGenerator,
}: {
  key: string
  fetcher: (data: Data) => Promise<ReturnValue>
  defaultConfigGenerator?: (
    params: Data | null
  ) => QueryConfig<Data, ReturnValue>
}) {
  const getQueryKey = createQueryKeys<Data>(key)

  async function fetchQuery(client: QueryClient | null, data: Data) {
    const cachedData = client?.getQueryData(getQueryKey(data))
    if (cachedData) {
      return cachedData as ReturnValue
    }

    const res = await fetcher(data)
    if (client) client.setQueryData(getQueryKey(data), res ?? null)

    return res
  }

  return {
    getQueryKey,
    invalidate: createQueryInvalidation<Data>(key),
    useQuery: (data: Data, config?: QueryConfig<Data, ReturnValue>) => {
      const defaultConfig = defaultConfigGenerator?.(data)
      const mergedConfig = mergeQueryConfig(config, defaultConfig)
      return useQuery(
        [key, data],
        queryWrapper<ReturnValue, Data, void>(
          ({ data }) => fetcher(data),
          async () => undefined
        ),
        mergedConfig
      )
    },
    useQueries: (data: Data[], config?: QueryConfig<Data, ReturnValue>) => {
      const defaultConfig = defaultConfigGenerator?.(null)
      const mergedConfig = mergeQueryConfig(config, defaultConfig)
      return useQueries({
        queries: data.map((singleData) => {
          return {
            queryKey: [key, singleData],
            queryFn: queryWrapper<ReturnValue, Data, void>(
              ({ data }) => fetcher(data),
              async () => undefined
            ),
            ...mergedConfig,
          }
        }),
      })
    },
    setQueryData: (
      client: QueryClient,
      data: Data,
      value: Updater<
        ReturnValue | null | undefined,
        ReturnValue | null | undefined
      >
    ) => {
      client.setQueryData(getQueryKey(data), value ?? null)
    },
    fetchQuery,
    fetchQueries: async (client: QueryClient, data: Data[]) => {
      return Promise.all(
        data.map((singleData) => fetchQuery(client, singleData))
      )
    },
  }
}
