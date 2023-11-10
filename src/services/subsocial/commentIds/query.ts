import {
  createQuery,
  createQueryInvalidation,
  createQueryKeys,
  poolQuery,
  QueryConfig,
} from '@/subsocial-query'
import {
  useSubsocialQueries,
  useSubsocialQuery,
} from '@/subsocial-query/subsocial/query'
import { QueryClient } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { squidRequest } from '../squid/utils'
import {
  useSubscribeCommentIdsByPostId,
  useSubscribeCommentIdsByPostIds,
} from './subscription'

const commentIdsByPostIdKey = 'comments-from-chain'
export const getCommentIdsQueryKey = createQueryKeys<string>(
  commentIdsByPostIdKey
)
function useCommentIdsByPostId(
  postId: string,
  config?: QueryConfig & { subscribe?: boolean }
) {
  useSubscribeCommentIdsByPostId(postId, !!config?.subscribe)
  return useSubsocialQuery(
    {
      key: commentIdsByPostIdKey,
      data: postId,
    },
    ({ api, data }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }

      // if subscribing, loading infinitely until the data is set manually from subscription handler
      return new Promise<string[]>(() => undefined)
    },
    config
  )
}

function useCommentIdsByPostIds(
  postIds: string[],
  config?: QueryConfig & { subscribe?: boolean }
) {
  useSubscribeCommentIdsByPostIds(postIds, !!config?.subscribe)
  return useSubsocialQueries(
    {
      key: commentIdsByPostIdKey,
      data: postIds,
    },
    async ({ api, data }) => {
      if (!config?.subscribe) {
        return api.blockchain.getReplyIdsByPostId(data)
      }

      // if subscribing, loading infinitely until the data is set manually from subscription handler
      return new Promise<string[]>(() => undefined)
    },
    config
  )
}

async function fetchQuery(client: QueryClient | null, data: string) {
  const cachedData = client?.getQueryData(getCommentIdsQueryKey(data))
  if (cachedData) {
    return cachedData as string[]
  }

  const { getSubsocialApi } = await import(
    '@/subsocial-query/subsocial/connection'
  )
  const api = await getSubsocialApi()
  const res = await api.blockchain.getReplyIdsByPostId(data)

  if (client) {
    client.setQueryData(getCommentIdsQueryKey(data), res ?? null)
  }
  return res
}
export const getCommentIdsByPostIdFromChainQuery = {
  getQueryKey: getCommentIdsQueryKey,
  useQuery: useCommentIdsByPostId,
  useQueries: useCommentIdsByPostIds,
  invalidate: createQueryInvalidation(commentIdsByPostIdKey),
  setQueryData: (client, data, value) => {
    client.setQueryData(getCommentIdsQueryKey(data), value ?? null)
  },
  setQueryInitialData: (client, data, value) => {
    client.setQueryData(getCommentIdsQueryKey(data), value ?? null)
    client.invalidateQueries(getCommentIdsQueryKey(data))
  },
  getQueryData: (client, data) => {
    return client.getQueryData(getCommentIdsQueryKey(data)) as string[]
  },
  fetchQuery,
  fetchQueries: async (client, data) => {
    return Promise.all(data.map((singleData) => fetchQuery(client, singleData)))
  },
} satisfies ReturnType<typeof createQuery<string, string[]>>

const getMessagesCountAfterTime = poolQuery<
  { chatId: string; time: number },
  { chatId: string; totalCount: number }
>({
  multiCall: async (params) => {
    if (!params.length) return []
    const queries: { query: string; chatId: string }[] = []
    const promises = params.map(async ({ chatId, time }) => {
      const isoDate = new Date(time).toISOString()
      queries.push({
        query: `
          chat${chatId}: postsConnection (where: { createdAtTime_gt: "${isoDate}", rootPost: { id_eq: "${chatId}" } }, orderBy: id_ASC) {
            totalCount
          }
        `,
        chatId,
      })
    })
    await Promise.all(promises)

    if (queries.length === 0) {
      return []
    }

    const data = (await squidRequest({
      document: gql`
        query {
          ${queries.map(({ query }) => query).join('\n')}
        }
      `,
    })) as { [key: string]: { totalCount: number } }

    const res: { chatId: string; totalCount: number }[] = queries.map(
      ({ chatId }) => {
        return {
          chatId,
          totalCount: data[`chat${chatId}`].totalCount,
        }
      }
    )
    return res
  },
})
export const getMessagesCountAfterTimeQuery = createQuery({
  key: 'ownedPostIds',
  fetcher: getMessagesCountAfterTime,
})
