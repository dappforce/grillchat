import { CHAT_PER_PAGE } from '@/constants/chat'
import { TIME_CONSTRAINT } from '@/constants/chat-rules'
import { getPostQuery, getServerTime } from '@/services/api/query'
import { queryClient } from '@/services/provider'
import { QueryConfig, createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import {
  QueryClient,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { gql } from 'graphql-request'
import {
  commentIdsOptimisticEncoder,
  isClientGeneratedOptimisticId,
} from '../../subsocial/commentIds/optimistic'
import {
  GetCommentIdsInPostIdQuery,
  GetCommentIdsInPostIdQueryVariables,
  GetLastPostedMemeQuery,
  GetLastPostedMemeQueryVariables,
  GetOwnedPostsQuery,
  GetOwnedPostsQueryVariables,
  GetPostMetadataQuery,
  GetPostMetadataQueryVariables,
  GetPostsBySpaceIdQuery,
  GetPostsBySpaceIdQueryVariables,
  GetUnreadCountQuery,
  GetUnreadCountQueryVariables,
  QueryOrder,
} from '../generated-query'
import { mapDatahubPostFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'
import { DATAHUB_POST_FRAGMENT } from './fetcher'
import { lastSentMessageStorage } from './mutation'

const GET_COMMENT_IDS_IN_POST_ID = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetCommentIdsInPostId($args: FindPostsWithFilterArgs!) {
    posts(args: $args) {
      data {
        ...DatahubPostFragment
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
type Data = {
  postId: string
  onlyDisplayUnapprovedMessages: boolean
  myAddress: string
}
async function getPaginatedPostIdsByRootPostId({
  page,
  postId,
  client,
  onlyDisplayUnapprovedMessages,
  myAddress,
}: {
  page: number
  client?: QueryClient | null
} & Data): Promise<PaginatedPostsData> {
  if (!postId || !client)
    return { data: [], page, hasMore: false, totalData: 0 }

  const oldIds = getPaginatedPostIdsByPostId.getFirstPageData(client, {
    postId,
    onlyDisplayUnapprovedMessages,
    myAddress,
  })
  const firstPageDataLength = oldIds?.length || CHAT_PER_PAGE

  // only first page that has dynamic content, where its length can increase from:
  // - subscription
  // - invalidation
  // so the offset has to accommodate the length of the current first page
  let offset = Math.max((page - 2) * CHAT_PER_PAGE + firstPageDataLength, 0)
  if (page === 1) offset = 0

  const res = await datahubQueryRequest<
    GetCommentIdsInPostIdQuery,
    GetCommentIdsInPostIdQueryVariables
  >({
    document: GET_COMMENT_IDS_IN_POST_ID,
    variables: {
      args: {
        filter:
          myAddress && !onlyDisplayUnapprovedMessages
            ? {
                OR: [
                  {
                    rootPostId: postId,
                    approvedInRootPost: !onlyDisplayUnapprovedMessages,
                  },
                  {
                    createdByAccountAddress: myAddress,
                  },
                ],
              }
            : {
                rootPostId: postId,
                approvedInRootPost: !onlyDisplayUnapprovedMessages,
              },
        orderBy: 'createdAtTime',
        orderDirection: QueryOrder.Desc,
        pageSize: CHAT_PER_PAGE,
        offset,
      },
    },
  })
  const optimisticIds = new Set<string>()
  const ids: string[] = []
  const messages: PostData[] = []
  res.posts.data.forEach((post) => {
    optimisticIds.add('')

    const id = post.id
    ids.push(id)

    const mapped = mapDatahubPostFragment(post)
    messages.push(mapped)
    getPostQuery.setQueryData(client, id, mapped)
  })
  const totalData = res.posts.total ?? 0
  const hasMore = offset + ids.length < totalData

  const idsSet = new Set<string>(ids)

  // only adding the client optimistic ids, and unincluded ids if refetching first page
  // for fetching first page, no ids that has been fetched will be removed
  // ex: first fetch: id 1-50, and after invalidation, there is new data id 0
  // the result should be id 0-50 instead of 0-49
  let unincludedOptimisticIds: string[] = []
  let unincludedFirstPageIds: string[] = []
  if (page === 1 && oldIds) {
    const oldOptimisticIds = []

    let unincludedIdsIndex = oldIds.length

    // for example, if the page size is 3, and there is 1 new id
    // ids: [new, old1, old2], and oldIds: [old1, old2, old3]
    // so we need to get the unincludedOldIds from the end of the array (old3)
    let hasFoundIncludedId = false

    for (let i = oldIds.length - 1; i >= 0; i--) {
      const id = oldIds[i]

      if (isClientGeneratedOptimisticId(id)) {
        oldOptimisticIds.unshift(id)
      }

      if (hasFoundIncludedId) continue

      if (!idsSet.has(id)) {
        unincludedIdsIndex = i
      } else {
        hasFoundIncludedId = true
      }
    }

    unincludedFirstPageIds = oldIds.slice(unincludedIdsIndex)
    unincludedOptimisticIds = oldOptimisticIds.filter(
      (id) => !optimisticIds.has(commentIdsOptimisticEncoder.decode(id))
    )
  }

  return {
    data: [
      ...unincludedOptimisticIds,
      ...messages.map(({ id }) => id),
      ...unincludedFirstPageIds,
    ],
    page,
    hasMore,
    totalData,
  }
}
const COMMENT_IDS_QUERY_KEY = 'comments'
const getQueryKey = (data: Data) => [COMMENT_IDS_QUERY_KEY, data]
export const getPaginatedPostIdsByPostId = {
  getQueryKey,
  getFirstPageData: (client: QueryClient, data: Data) => {
    const cachedData = client?.getQueryData(getQueryKey(data))
    return ((cachedData as any)?.pages?.[0] as PaginatedPostsData | undefined)
      ?.data
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    data: Data,
    page = 1
  ) => {
    const res = await getPaginatedPostIdsByRootPostId({
      ...data,
      page,
      client,
    })
    if (!client) return res

    client.setQueryData(getQueryKey(data), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setQueryFirstPageData: (
    client: QueryClient,
    data: Data,
    updater: (oldIds?: string[]) => string[] | undefined | null
  ) => {
    client.setQueryData(getQueryKey(data), (oldData: any) => {
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
  invalidateFirstQuery: (client: QueryClient, data: Data) => {
    client.invalidateQueries(getQueryKey(data), {
      refetchPage: (_, index) => index === 0,
    })
  },
  useInfiniteQuery: (
    data: Data,
    config?: QueryConfig
  ): UseInfiniteQueryResult<PaginatedPostsData, unknown> => {
    const client = useQueryClient()
    return useInfiniteQuery({
      ...config,
      queryKey: getQueryKey(data),
      queryFn: async ({ pageParam = 1, queryKey }) => {
        const [_, postId] = queryKey
        const res = await getPaginatedPostIdsByRootPostId({
          ...data,
          page: pageParam,
          client,
        })

        // hotfix because in offchain chat (/offchain/18634) its not updating cache when first invalidated from server
        if (pageParam === 1) {
          client.setQueryData<{
            pageParams: number[]
            pages: PaginatedPostsData[]
          }>(getQueryKey(data), (oldData) => {
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
        createdAtTime
        summary
      }
    }
  }
`
const getPostMetadata = poolQuery<
  string,
  {
    lastCommentId: string
    totalCommentsCount: number
    postId: string
    createdAtTime: number
    summary: string
  }
>({
  name: 'getPostMetadata',
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
      const commentId = comment?.persistentId || comment?.id || ''
      return {
        lastCommentId: commentId,
        totalCommentsCount: parseInt(metadata.totalCommentsCount),
        postId: comment?.rootPostPersistentId || '',
        createdAtTime: comment?.createdAtTime || 0,
        summary: comment?.summary || '',
      }
    })
  },
})
export const getPostMetadataQuery = createQuery({
  key: 'post-metadata',
  fetcher: getPostMetadata,
  defaultConfigGenerator: (params) => ({
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: !!params,
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
  name: 'getUnreadCount',
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

export const GET_OWNED_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetOwnedPosts($address: String!) {
    posts(args: { filter: { ownedByAccountAddress: $address } }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`
async function getOwnedPosts(address: string, queryClient: QueryClient | null) {
  if (!address) return []

  const res = await datahubQueryRequest<
    GetOwnedPostsQuery,
    GetOwnedPostsQueryVariables
  >({
    document: GET_OWNED_POSTS,
    variables: { address },
  })
  return res.posts.data.map((post) => {
    const mapped = mapDatahubPostFragment(post)
    if (queryClient) getPostQuery.setQueryData(queryClient, post.id, mapped)
    return mapped
  })
}
export const getOwnedPostsQuery = createQuery({
  key: 'ownedPosts',
  fetcher: getOwnedPosts,
})

export const GET_POSTS_BY_SPACE_ID = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetPostsBySpaceId($id: String!) {
    posts(args: { filter: { spaceId: $id } }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`
async function getPostsBySpaceId(
  spaceId: string,
  queryClient: QueryClient | null
) {
  const res = await datahubQueryRequest<
    GetPostsBySpaceIdQuery,
    GetPostsBySpaceIdQueryVariables
  >({
    document: GET_POSTS_BY_SPACE_ID,
    variables: { id: spaceId },
  })
  const mappedPosts = res.posts.data.map((post) => {
    const mapped = mapDatahubPostFragment(post)
    if (queryClient) getPostQuery.setQueryData(queryClient, post.id, mapped)
    return mapped
  })
  return mappedPosts
}
export const getPostsBySpaceIdQuery = createQuery({
  key: 'postsBySpaceId',
  fetcher: getPostsBySpaceId,
  defaultConfigGenerator: (id) => ({
    enabled: !!id,
  }),
})

const GET_LAST_POSTED_MEME = gql`
  query GetLastPostedMeme($address: String!) {
    posts(
      args: {
        filter: { createdByAccountAddress: $address }
        pageSize: 1
        orderBy: "createdAtTime"
        orderDirection: DESC
      }
    ) {
      data {
        createdAtTime
      }
    }
  }
`
async function getTimeLeftUntilCanPost(address: string) {
  const [lastPostPromise, serverTimePromise] = await Promise.allSettled([
    datahubQueryRequest<
      GetLastPostedMemeQuery,
      GetLastPostedMemeQueryVariables
    >({
      document: GET_LAST_POSTED_MEME,
      variables: { address },
    }),
    getServerTime(),
  ] as const)
  const lastPost =
    lastPostPromise.status === 'fulfilled' ? lastPostPromise.value : null
  const serverTime =
    serverTimePromise.status === 'fulfilled'
      ? serverTimePromise.value
      : Date.now()

  const lastPostedTime = lastPost?.posts.data?.[0]?.createdAtTime
  const lastSentFromStorage = lastSentMessageStorage.get()

  let lastPosted = lastPostedTime ? new Date(lastPostedTime).getTime() : null
  if (lastSentFromStorage) {
    const dateFromStorage = new Date(lastSentFromStorage).getTime()
    if (!lastPosted || dateFromStorage > lastPosted) {
      lastPosted = dateFromStorage
    }
  }

  if (!lastPosted) return Infinity
  const timeLeft = lastPosted + TIME_CONSTRAINT - serverTime
  return Math.min(Math.max(timeLeft, 0), TIME_CONSTRAINT)
}
export const getTimeLeftUntilCanPostQuery = createQuery({
  key: 'lastPostedMeme',
  fetcher: getTimeLeftUntilCanPost,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
