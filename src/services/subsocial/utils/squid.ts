import { redisCallWrapper } from '@/server/cache'
import { createQuery } from '@/subsocial-query'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import { getSquidUrl } from '@/utils/env/client'

type DynamicSubsocialQueryFetcher<Data, ReturnValue> = {
  blockchain: (data: SubsocialQueryData<Data>) => Promise<ReturnValue>
  squid: (data: Data) => Promise<ReturnValue>
}
export function createDynamicSubsocialQuery<Data, ReturnValue>(
  key: string,
  fetcher: DynamicSubsocialQueryFetcher<Data, ReturnValue>
) {
  const isExistSquidUrl = !!getSquidUrl()

  if (isExistSquidUrl) {
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

type DataSource = 'blockchain' | 'squid'
export function standaloneDynamicFetcherWrapper<Data, ReturnValue>(
  fetcher: DynamicSubsocialQueryFetcher<Data, ReturnValue>
) {
  return async (data: Data, dataSource: DataSource = 'squid') => {
    const isExistSquidUrl = !!getSquidUrl()

    if (isExistSquidUrl && dataSource === 'squid') {
      return fetcher.squid(data)
    }

    const api = await getSubsocialApi()
    return fetcher.blockchain({ data, api })
  }
}

export function generateGetDataFromSquidWithBlockchainFallback<Param, Response>(
  getData: (params: Param[], dataSource?: DataSource) => Promise<Response[]>,
  mapper: {
    paramToId: (param: Param) => string
    responseToId: (response: Response) => string
  },
  processor?: {
    blockchainResponse?: (data: Response) => void
    squidResponse?: (data: Response) => void
  },
  getInvalidatedDataRedisKey?: (id: string) => string
) {
  return async (params: Param[]): Promise<Response[]> => {
    const { paramToId, responseToId } = mapper

    let data: Response[] = []

    const canFetchedUsingSquid: Param[] = []
    if (getInvalidatedDataRedisKey) {
      await Promise.all(
        params.map(async (param) => {
          const id = paramToId(param)
          return redisCallWrapper(async (redis) => {
            const isInvalidated = await redis?.get(
              getInvalidatedDataRedisKey(id)
            )
            if (!isInvalidated) canFetchedUsingSquid.push(param)
          })
        })
      )
    }

    try {
      data = await getData(canFetchedUsingSquid)
      if (processor?.squidResponse) {
        data.forEach((response) => {
          processor.squidResponse?.(response)
        })
      }
    } catch (e) {
      console.error('Error fetching posts from squid', e)
    }

    const foundPostIds = new Set()
    data.forEach((post) => foundPostIds.add(responseToId(post)))

    const notFoundPostIds = params.filter(
      (param) => !foundPostIds.has(paramToId(param))
    )

    const mergedPosts = data
    try {
      const dataFromBlockchain = await getData(notFoundPostIds, 'blockchain')
      if (processor?.blockchainResponse) {
        dataFromBlockchain.forEach((response) => {
          processor.blockchainResponse?.(response)
        })
      }
      mergedPosts.push(...dataFromBlockchain)
    } catch (e) {
      console.error('Error fetching posts from blockchain', e)
    }

    const filteredPosts = mergedPosts.filter((post) => !!post)
    return filteredPosts
  }
}
