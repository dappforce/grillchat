import {
  createQueryInvalidation,
  createQueryKeys,
  QueryConfig,
} from '@/subsocial-query'
import {
  useSubsocialQueries,
  useSubsocialQuery,
} from '@/subsocial-query/subsocial/query'
import { getDatahubConfig } from '@/utils/env/client'
import { QueryClient } from '@tanstack/react-query'
import { getCommentIdsByPostIdFromDatahubQuery } from '../datahub/posts/query'
import {
  useSubscribeCommentIdsByPostId,
  useSubscribeCommentIdsByPostIds,
} from './subscription'

const commentIdsByPostIdKey = 'comments'
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
export let getCommentIdsByPostIdQuery = {
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
} satisfies typeof getCommentIdsByPostIdFromDatahubQuery
if (getDatahubConfig()) {
  getCommentIdsByPostIdQuery = getCommentIdsByPostIdFromDatahubQuery
}
