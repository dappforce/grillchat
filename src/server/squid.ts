import { redisCallWrapper } from '@/server/cache'
import { DataSource } from '@/services/subsocial/utils'

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
