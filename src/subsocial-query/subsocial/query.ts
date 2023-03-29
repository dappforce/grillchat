import { SubsocialApi } from '@subsocial/api'
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query'
import {
  createQueryInvalidation,
  createQueryKeys,
  mergeQueryConfig,
  queryWrapper,
} from '..'
import { QueryConfig } from '../types'
import { getSubsocialApi } from './connection'

export type SubsocialParam<T> = { data: T } & { api: SubsocialApi }

export function useSubsocialQuery<ReturnValue, Data>(
  params: { key: string; data: Data | null },
  func: (params: SubsocialParam<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQuery(
    [params.key, params.data],
    queryWrapper<ReturnValue, Data, { api: SubsocialApi }>(func, async () => {
      const api = await getSubsocialApi()
      return { api }
    }),
    mergedConfig
  )
}

export function useSubsocialQueries<ReturnValue, Data>(
  params: { key: string; data: (Data | null)[] },
  func: (
    params: SubsocialParam<Data> & { idx: number }
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
  getData: (params: SubsocialParam<Params>) => Promise<ReturnValue>
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
