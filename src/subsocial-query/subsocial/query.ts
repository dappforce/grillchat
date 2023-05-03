import { type SubsocialApi } from '@subsocial/api'
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query'
import {
  createQueryInvalidation,
  createQueryKeys,
  mergeQueryConfig,
  queryWrapper,
} from '..'
import { QueryConfig } from '../types'

export type SubsocialQueryData<T> = { data: T } & { api: SubsocialApi }

export function useSubsocialQuery<ReturnValue, Data>(
  queryData: { key: string; data: Data | null },
  func: (data: SubsocialQueryData<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
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
  queryData: { key: string; data: (ReturnValue | null)[] },
  func: (
    data: SubsocialQueryData<ReturnValue> & { idx: number }
  ) => Promise<Data>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<Data, ReturnValue>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQueries({
    queries: queryData.data.map((singleData, idx) => {
      return {
        queryKey: [queryData.key, singleData],
        queryFn: queryWrapper<
          Data,
          ReturnValue,
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
}: {
  key: string
  fetcher: (params: SubsocialQueryData<Data>) => Promise<ReturnValue>
}) {
  const getQueryKey = createQueryKeys<Data>(key)
  return {
    getQueryKey,
    invalidate: createQueryInvalidation<Data>(key),
    useQuery: (data: Data, config?: QueryConfig<Data, any>) => {
      return useSubsocialQuery({ key, data }, fetcher, config)
    },
    useQueries: (data: Data[], config?: QueryConfig<Data, any>) => {
      return useSubsocialQueries({ key, data }, fetcher, config)
    },
    setQueryData: (client: QueryClient, data: Data, value: ReturnValue) => {
      client.setQueryData(getQueryKey(data), value ?? null)
    },
  }
}
