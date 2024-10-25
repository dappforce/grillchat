import { type SubsocialApi } from '@subsocial/api'
import {
  QueryClient,
  Updater,
  useQueries,
  useQuery,
} from '@tanstack/react-query'
import {
  createQueryInvalidation,
  createQueryKeys,
  mergeQueryConfig,
  queryWrapper,
} from '..'
import { QueryConfig } from '../types'

export type SubsocialQueryData<T> = { data: T } & { api: SubsocialApi }

export function useSubsocialQuery<Data, ReturnValue>(
  queryData: { key: string; data: Data },
  func: (data: SubsocialQueryData<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<Data, ReturnValue>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQuery(
    [queryData.key, queryData.data],
    queryWrapper<ReturnValue, Data, { api: SubsocialApi }>(func, async () => {
      const { getSubsocialApi } = await import('./connection')
      const api = await getSubsocialApi()
      return { api }
    }),
    mergedConfig
  )
}

export function useSubsocialQueries<Data, ReturnValue>(
  queryData: { key: string; data: Data[] },
  func: (
    data: SubsocialQueryData<Data> & { idx: number }
  ) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<Data, ReturnValue>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQueries({
    queries: queryData.data.map((singleData, idx) => {
      return {
        queryKey: [queryData.key, singleData],
        queryFn: queryWrapper<
          ReturnValue,
          Data,
          { api: SubsocialApi; idx: number }
        >(func, async () => {
          const { getSubsocialApi } = await import('./connection')
          const api = await getSubsocialApi()
          return { api, idx }
        }),
        ...mergedConfig,
      }
    }),
  })
}

export function createSubsocialQuery<Data, ReturnValue>({
  key,
  fetcher,
  defaultConfigGenerator,
}: {
  key: string
  fetcher: (params: SubsocialQueryData<Data>) => Promise<ReturnValue>
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

    const { getSubsocialApi } = await import('./connection')
    const api = await getSubsocialApi()
    const res = await fetcher({ api, data })

    if (client) {
      client.setQueryData(getQueryKey(data), res ?? null)
    }
    return res
  }

  return {
    getQueryKey,
    invalidate: createQueryInvalidation<Data>(key),
    useQuery: (data: Data, config?: QueryConfig<Data, ReturnValue>) => {
      const defaultConfig = defaultConfigGenerator?.(data)
      const mergedConfig = mergeQueryConfig(config, defaultConfig)
      return useSubsocialQuery({ key, data }, fetcher, mergedConfig)
    },
    useQueries: (data: Data[], config?: QueryConfig<Data, ReturnValue>) => {
      const defaultConfig = defaultConfigGenerator?.(null)
      const mergedConfig = mergeQueryConfig(config, defaultConfig)
      return useSubsocialQueries({ key, data }, fetcher, mergedConfig)
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
    setQueryInitialData: (
      client: QueryClient,
      data: Data,
      value: Updater<
        ReturnValue | null | undefined,
        ReturnValue | null | undefined
      >
    ) => {
      client.setQueryData(getQueryKey(data), value ?? null)
      client.invalidateQueries(getQueryKey(data))
    },
    fetchQuery,
    fetchQueries: async (client: QueryClient, data: Data[]) => {
      return Promise.all(
        data.map((singleData) => fetchQuery(client, singleData))
      )
    },
  }
}
