import { type SubsocialApi } from '@subsocial/api'
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query'
import {
  createQueryInvalidation,
  createQueryKeys,
  mergeQueryConfig,
  queryWrapper,
} from '..'
import { QueryConfig } from '../types'

export type SubsocialParams<T> = { data: T } & { api: SubsocialApi }

export function useSubsocialQuery<ReturnValue, Data>(
  params: { key: string; data: Data | null },
  func: (params: SubsocialParams<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQuery(
    [params.key, params.data],
    queryWrapper<ReturnValue, Data, { api: SubsocialApi }>(func, async () => {
      const { getSubsocialApi } = await import('./connection')
      const api = await getSubsocialApi()
      return { api }
    }),
    mergedConfig
  )
}

export function useSubsocialQueries<ReturnValue, Data>(
  params: { key: string; data: (Data | null)[] },
  func: (
    params: SubsocialParams<Data> & { idx: number }
  ) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQueries({
    queries: params.data.map((singleData, idx) => {
      return {
        queryKey: [params.key, singleData],
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

export function createSubsocialQuery<Params, ReturnValue>({
  key,
  getData,
}: {
  key: string
  getData: (params: SubsocialParams<Params>) => Promise<ReturnValue>
}) {
  const getQueryKey = createQueryKeys<Params>(key)
  return {
    getQueryKey,
    invalidate: createQueryInvalidation<Params>(key),
    useQuery: (data: Params, config?: QueryConfig<Params, any>) => {
      return useSubsocialQuery({ key, data }, getData, config)
    },
    useQueries: (data: Params[], config?: QueryConfig<Params, any>) => {
      return useSubsocialQueries({ key, data }, getData, config)
    },
    setQueryData: (client: QueryClient, data: Params, value: ReturnValue) => {
      client.setQueryData(getQueryKey(data), value ?? null)
    },
  }
}
