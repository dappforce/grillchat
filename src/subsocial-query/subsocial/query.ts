import { SubsocialApi } from '@subsocial/api'
import { useQueries, useQuery } from '@tanstack/react-query'
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
  func: (params: SubsocialParam<Data>) => Promise<ReturnValue>,
  config?: QueryConfig,
  defaultConfig?: QueryConfig<ReturnValue, Data>
) {
  const mergedConfig = mergeQueryConfig(config, defaultConfig)
  return useQueries({
    queries: params.data.map((singleData) => {
      return {
        queryKey: [params.key, singleData],
        queryFn: queryWrapper<ReturnValue, Data, { api: SubsocialApi }>(
          func,
          async () => {
            const api = await getSubsocialApi()
            return { api }
          }
        ),
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
  return {
    getQueryKey: createQueryKeys<Params>(key),
    invalidate: createQueryInvalidation<Params>(key),
    useQuery: (data: Params, config?: QueryConfig<Params, any>) => {
      return useSubsocialQuery({ key, data }, getData, config)
    },
    useQueries: (data: Params[], config?: QueryConfig<Params, any>) => {
      return useSubsocialQueries({ key, data }, getData, config)
    },
  }
}
