import { isDatahubAvailable } from '@/services/datahub/utils'
import { createQuery } from '@/subsocial-query'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import { isSquidAvailable } from '../squid/utils'

type DynamicSubsocialQueryFetcher<Data, ReturnValue> = {
  blockchain: (data: SubsocialQueryData<Data>) => Promise<ReturnValue>
  squid: (data: Data) => Promise<ReturnValue>
  datahub?: (data: Data) => Promise<ReturnValue>
}
export function createDynamicSubsocialQuery<Data, ReturnValue>(
  key: string,
  fetcher: DynamicSubsocialQueryFetcher<Data, ReturnValue>
) {
  if (isDatahubAvailable && fetcher.datahub) {
    return createQuery({
      key,
      fetcher: fetcher.datahub,
    })
  }

  if (isSquidAvailable) {
    return createQuery({
      key,
      fetcher: fetcher.squid,
    })
  }

  return createSubsocialQuery({
    key,
    fetcher: fetcher.blockchain,
  })
}

export type DataSource = 'blockchain' | 'squid' | 'datahub'
export function standaloneDynamicFetcherWrapper<Data, ReturnValue>(
  fetcher: DynamicSubsocialQueryFetcher<Data, ReturnValue>
) {
  return async (data: Data, dataSource: DataSource = 'squid') => {
    // datahub is the default data source
    if (isDatahubAvailable && fetcher.datahub) {
      return fetcher.datahub(data)
    }

    if (isSquidAvailable && dataSource === 'squid') {
      return fetcher.squid(data)
    }

    const api = await getSubsocialApi()
    return fetcher.blockchain({ data, api })
  }
}
