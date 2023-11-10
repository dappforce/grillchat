import { CHAT_PER_PAGE } from '@/constants/chat'
import { getPostQuery } from '@/services/api/query'
import { queryClient } from '@/services/provider'
import { createQuery, poolQuery, QueryConfig } from '@/subsocial-query'
import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { gql } from 'graphql-request'
import {
  commentIdsOptimisticEncoder,
  isClientGeneratedOptimisticId,
} from '../../commentIds/optimistic'
import {
  GetCommentIdsInPostIdQuery,
  GetCommentIdsInPostIdQueryVariables,
  GetPostMetadataQuery,
  GetPostMetadataQueryVariables,
  GetUnreadCountQuery,
  GetUnreadCountQueryVariables,
  QueryOrder,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_COMMENT_IDS_IN_POST_ID = gql`
  query GetCommentIdsInPostId($where: FindPostsArgs!) {
    findPosts(where: $where) {
      data {
        id
        persistentId
        optimisticId
      }
      total
    }
  }
`
export type PaginatedPostsData = {
  data: string[]
  page: number
  hasMore: boolean
  totalData: number
}
async function getPaginatedPostsByRootPostId({
  page,
  postId,
  client = queryClient,
}: {
  postId: string
  page: number
  client?: QueryClient
}): Promise<PaginatedPostsData> {
  const oldIds = getPaginatedPostsByPostIdFromDatahubQuery.getFirstPageData(
    client,
    postId
  )
  const firstPageDataLength = oldIds?.length || CHAT_PER_PAGE

  // only first page that has dynamic content, where its length can increase from:
  // - subscription
  // - invalidation
  // so the offset has to accommodate the length of the current first page
  const offset = Math.min((page - 2) * CHAT_PER_PAGE + firstPageDataLength, 0)

  const res = await datahubQueryRequest<
    GetCommentIdsInPostIdQuery,
    GetCommentIdsInPostIdQueryVariables
  >({
    document: GET_COMMENT_IDS_IN_POST_ID,
    variables: {
      where: {
        rootPostPersistentId: postId,
        orderBy: 'createdAtTime',
        orderDirection: QueryOrder.Desc,
        pageSize: CHAT_PER_PAGE,
        offset,
      },
    },
  })
  const optimisticIds = new Set<string>()
  const ids = res.findPosts.data.map((post) => {
    optimisticIds.add(post.optimisticId ?? '')

    const id = post.persistentId || post.id
    return id
  })
  const totalData = res.findPosts.total ?? 0
  const hasMore = totalData > page * CHAT_PER_PAGE + ids.length

  const idsSet = new Set<string>(ids)

  // only adding the client optimistic ids, and unincluded ids if refetching first page
  // for fetching first page, no ids that has been fetched will be removed
  // ex: first fetch: id 1-50, and after invalidation, there is new data id 0
  // the result should be id 0-50 instead of 0-49
  let unincludedOptimisticIds: string[] = []
  let unincludedFirstPageIds: string[] = []
  if (page === 1) {
    if (oldIds) {
      const oldOptimisticIds = []

      let unincludedIdsIndex = oldIds.length
      let hasFoundIncludedId = false

      for (let i = oldIds.length - 1; i >= 0; i--) {
        const id = oldIds[i]

        if (isClientGeneratedOptimisticId(id)) {
          oldOptimisticIds.unshift(id)
        }

        if (!idsSet.has(id) && !hasFoundIncludedId) {
          unincludedIdsIndex = i
        } else {
          hasFoundIncludedId = true
        }
      }

      unincludedFirstPageIds = oldOptimisticIds.slice(unincludedIdsIndex)
      unincludedOptimisticIds = oldOptimisticIds.filter(
        (id) => !optimisticIds.has(commentIdsOptimisticEncoder.decode(id))
      )
    }
  }

  return {
    data: [...unincludedOptimisticIds, ...ids, ...unincludedFirstPageIds],
    page,
    hasMore,
    totalData,
  }
}
const COMMENT_IDS_QUERY_KEY = 'comments'
const getQueryKey = (postId: string) => [COMMENT_IDS_QUERY_KEY, postId]
export const getPaginatedPostsByPostIdFromDatahubQuery = {
  getQueryKey,
  getFirstPageData: (client: QueryClient, postId: string) => {
    const cachedData = client?.getQueryData(getQueryKey(postId))
    return ((cachedData as any)?.pages?.[0] as PaginatedPostsData | undefined)
      ?.data
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    postId: string,
    page = 1
  ) => {
    const res = await getPaginatedPostsByRootPostId({
      postId,
      page,
      client: client ?? undefined,
    })
    if (!client) return res

    client.setQueryData(getQueryKey(postId), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setQueryFirstPageData: (
    client: QueryClient,
    postId: string,
    updater: (oldIds?: string[]) => string[] | undefined | null
  ) => {
    client.setQueryData(getQueryKey(postId), (oldData: any) => {
      const firstPage = oldData?.pages?.[0] as PaginatedPostsData | undefined
      const newPages = [...(oldData?.pages ?? [])]
      const newFirstPageMessageIds = updater(firstPage?.data)
      newPages.splice(0, 1, {
        ...firstPage,
        data: newFirstPageMessageIds,
        totalData: newFirstPageMessageIds?.length ?? 0,
      } as PaginatedPostsData)
      return {
        pageParams: [...(oldData?.pageParams ?? [])],
        pages: [...newPages],
      }
    })
  },
  invalidateFirstQuery: (client: QueryClient, postId: string) => {
    client.invalidateQueries(getQueryKey(postId), {
      refetchPage: (_, index) => index === 0,
    })
  },
  useInfiniteQuery: (postId: string, config?: QueryConfig) => {
    const client = useQueryClient()
    return useInfiniteQuery({
      ...config,
      queryKey: getQueryKey(postId),
      queryFn: async ({ pageParam = 1, queryKey }) => {
        const [_, postId] = queryKey
        const res = await getPaginatedPostsByRootPostId({
          postId,
          page: pageParam,
        })

        // hotfix because in offchain chat (/offchain/18634) its not updating cache when first invalidated from server
        if (pageParam === 1) {
          client.setQueryData<{
            pageParams: number[]
            pages: PaginatedPostsData[]
          }>(getQueryKey(postId), (oldData) => {
            if (
              !oldData ||
              !Array.isArray(oldData.pageParams) ||
              !Array.isArray(oldData.pages)
            )
              return oldData
            const pages = [...oldData.pages]
            pages.splice(0, 1, res)
            return {
              ...oldData,
              pageParams: [...oldData.pageParams],
              pages,
            }
          })
        }

        return res
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    })
  },
}

const GET_POST_METADATA = gql`
  query GetPostMetadata($where: PostMetadataInput!) {
    postMetadata(where: $where) {
      totalCommentsCount
      latestComment {
        id
        persistentId
        rootPostPersistentId
      }
    }
  }
`
const getPostMetadata = poolQuery<
  string,
  { lastCommentId: string; totalCommentsCount: number; postId: string }
>({
  multiCall: async (data) => {
    const res = await datahubQueryRequest<
      GetPostMetadataQuery,
      GetPostMetadataQueryVariables
    >({
      document: GET_POST_METADATA,
      variables: {
        where: { persistentIds: data },
      },
    })
    const postMetadata = res.postMetadata
    return postMetadata.map((metadata) => {
      const comment = metadata.latestComment
      return {
        lastCommentId: comment?.persistentId || comment?.id || '',
        totalCommentsCount: parseInt(metadata.totalCommentsCount),
        postId: metadata.latestComment?.rootPostPersistentId || '',
      }
    })
  },
})
export const getPostMetadataQuery = createQuery({
  key: 'post-metadata',
  fetcher: getPostMetadata,
  defaultConfigGenerator: () => ({
    refetchOnWindowFocus: true,
    staleTime: 0,
  }),
})

const GET_UNREAD_COUNT = gql`
  query GetUnreadCount($where: UnreadMessagesInput!) {
    unreadMessages(where: $where) {
      id
      unreadCount
    }
  }
`
const getUnreadCount = poolQuery<
  { chatId: string; lastRead: { postId?: string; timestamp?: number } },
  number
>({
  multiCall: async (data) => {
    const pairs = await Promise.all(
      data.map(async ({ chatId, lastRead }) => {
        const { postId, timestamp } = lastRead
        if (postId) {
          const lastReadPost = await getPostQuery.fetchQuery(
            queryClient,
            postId
          )
          const lastReadTime = lastReadPost?.struct.createdAtTime
          if (!lastReadTime) return

          return {
            id: chatId,
            timestamp_gt: new Date(
              lastReadPost.struct.createdAtTime
            ).toISOString(),
          }
        } else {
          return {
            id: chatId,
            timestamp_gt: new Date(timestamp || 0).toISOString(),
          }
        }
      })
    )
    const filteredPairs = pairs.filter(Boolean)
    const res = await datahubQueryRequest<
      GetUnreadCountQuery,
      GetUnreadCountQueryVariables
    >({
      document: GET_UNREAD_COUNT,
      variables: {
        where: {
          idTimestampPairs: filteredPairs,
        },
      },
    })

    return data.map(({ chatId }) => {
      const unreadCount = res.unreadMessages.find(
        (message) => message.id === chatId
      )?.unreadCount
      return unreadCount || 0
    })
  },
})
export const getUnreadCountQuery = createQuery({
  key: 'unread-count',
  fetcher: getUnreadCount,
  defaultConfigGenerator: () => ({
    refetchOnWindowFocus: true,
    staleTime: 0,
  }),
})
