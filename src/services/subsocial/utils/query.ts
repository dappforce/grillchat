import { isDatahubAvailable } from '@/services/datahub/utils'
import { createQuery } from '@/subsocial-query'
import { createSubsocialQuery } from '@/subsocial-query/subsocial/query'
import { isSquidAvailable } from '../squid/utils'
import { DynamicSubsocialQueryFetcher } from './service-mapper'

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
