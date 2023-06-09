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
    fetchQuery: async (client: QueryClient, data: Data) => {
      const { getSubsocialApi } = await import('./connection')
      const api = await getSubsocialApi()
      const res = await fetcher({ api, data })
      client.setQueryData(getQueryKey(data), res ?? null)
      return res
    },
  }
}
