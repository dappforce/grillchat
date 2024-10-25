import usePaginatedMessageIds from '@/components/chats/hooks/usePaginatedMessageIds'
import { CHAT_PER_PAGE } from '@/constants/chat'
import { env } from '@/env.mjs'
import { getPostQuery, getServerTime } from '@/services/api/query'
import { queryClient } from '@/services/provider'
import { QueryConfig, createQuery, poolQuery } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import { isEmptyArray } from '@subsocial/utils'
import {
  QueryClient,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import { useEffect } from 'react'
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
  GetUnapprovedMemesCountQuery,
  GetUnapprovedMemesCountQueryVariables,
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
  pageSize?: number
}
export const blockedCountOffset = {
  blocked: 0,
}
async function getPaginatedPostIdsByRootPostId({
  page,
  postId,
  client,
  onlyDisplayUnapprovedMessages,
  myAddress,
  pageSize,
}: {
  page: number
  client?: QueryClient | null
  pageSize?: number
} & Data): Promise<PaginatedPostsData> {
  if (!postId || !client)
    return { data: [], page, hasMore: false, totalData: 0 }

  const oldIds = getPaginatedPostIdsByPostId.getFirstPageData(client, {
    postId,
    onlyDisplayUnapprovedMessages,
    myAddress,
  })

  const chatPerPage = onlyDisplayUnapprovedMessages ? 50 : CHAT_PER_PAGE
  const firstPageDataLength = oldIds?.length || chatPerPage

  const postsPerPage = pageSize || chatPerPage

  // only first page that has dynamic content, where its length can increase from:
  // - subscription
  // - invalidation
  // so the offset has to accommodate the length of the current first page
  let offset = Math.max((page - 2) * postsPerPage + firstPageDataLength, 0)
  if (page === 1) offset = 0
  if (onlyDisplayUnapprovedMessages) {
    // no need to check for first page for pending tabs, to avoid skipped data
    offset = Math.max((page - 1) * postsPerPage - blockedCountOffset.blocked, 0)
  }

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
                    rootPostId: postId,
                    createdByAccountAddress: myAddress,
                  },
                ],
              }
            : {
                rootPostId: postId,
                approvedInRootPost: !onlyDisplayUnapprovedMessages,
                blockedByModeration: false,
              },
        orderBy: onlyDisplayUnapprovedMessages
          ? 'createdAtTime'
          : 'approvedInRootPostAtTime',
        orderDirection: onlyDisplayUnapprovedMessages
          ? QueryOrder.Asc
          : QueryOrder.Desc,
        pageSize: postsPerPage,
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
  getCurrentPageNumber: (client: QueryClient, data: Data) => {
    const cachedData = client?.getQueryData(getQueryKey(data))
    return (cachedData as any)?.pages?.length
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    data: Data,
    page = 1,
    pageSize?: number
  ) => {
    const res = await getPaginatedPostIdsByRootPostId({
      ...data,
      page,
      client,
      pageSize,
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
  invalidateLastQuery: (client: QueryClient, data: Data) => {
    client.refetchQueries(getQueryKey(data), {
      refetchPage: (_, index, allPages) => {
        const lastPageIndex = allPages.length - 1
        if (index !== lastPageIndex) return false
        // only fetch if its the last page and its the real "last" page, where hasMore is false
        if (
          !allPages[lastPageIndex] ||
          !(allPages[lastPageIndex] as { hasMore: boolean }).hasMore
        )
          return true
        return false
      },
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
        pageSize: 4
        orderBy: "createdAtTime"
        orderDirection: DESC
      }
    ) {
      data {
        approvedInRootPost
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

  const hasSentMoreThan3Memes = (lastPost?.posts.data.length ?? 0) > 3
  const lastPostedPost = lastPost?.posts.data[0]
  const usedPost = hasSentMoreThan3Memes
    ? lastPostedPost
    : lastPost?.posts.data.find((post) => post.approvedInRootPost)

  const lastPostedTime = usedPost?.createdAtTime
  const lastSentFromStorage = lastSentMessageStorage.get()

  let lastPosted = lastPostedTime ? new Date(lastPostedTime).getTime() : null
  if (lastSentFromStorage) {
    const dateFromStorage = new Date(lastSentFromStorage).getTime()
    if (!lastPosted || dateFromStorage > lastPosted) {
      lastPosted = dateFromStorage
    }
  }

  if (!lastPosted) return { timeLeft: Infinity }
  const timeLeft = lastPosted + env.NEXT_PUBLIC_TIME_CONSTRAINT - serverTime
  return {
    timeLeft: Math.min(Math.max(timeLeft, 0), env.NEXT_PUBLIC_TIME_CONSTRAINT),
  }
}
export const getTimeLeftUntilCanPostQuery = createQuery({
  key: 'lastPostedMeme',
  fetcher: getTimeLeftUntilCanPost,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_USER_POSTED_MEMES_FOR_COUNT = gql`
  query GetUnapprovedMemesCount($address: String!, $postId: String!) {
    posts(
      args: {
        filter: {
          createdAtTimeGt: "2024-07-10T17:37:35.000Z"
          createdByAccountAddress: $address
          rootPostId: $postId
        }
        pageSize: 100
      }
    ) {
      data {
        id
        approvedInRootPost
      }
    }
  }
`
export const getUserPostedMemesForCountQuery = createQuery({
  key: 'userPostedMemesForCount',
  fetcher: async ({ address, chatId }: { chatId: string; address: string }) => {
    const res = await datahubQueryRequest<
      GetUnapprovedMemesCountQuery,
      GetUnapprovedMemesCountQueryVariables
    >({
      document: GET_USER_POSTED_MEMES_FOR_COUNT,
      variables: { address, postId: chatId },
    })
    return res.posts.data
  },
  defaultConfigGenerator: (params) => ({
    enabled: !!params?.address && !!params.chatId,
  }),
})

const GET_POSTS_COUNT_BY_TODAY = gql`
  query GetPostsCountByToday(
    $createdAtTimeGte: String!
    $createdAtTimeLte: String!
    $postId: String!
  ) {
    posts(
      args: {
        filter: {
          createdAtTimeGte: $createdAtTimeGte
          createdAtTimeLte: $createdAtTimeLte
          rootPostId: $postId
        }
        pageSize: 100
      }
    ) {
      total
    }
  }
`
export const getPostsCountByTodayQuery = createQuery({
  key: 'getPostsCountByToday',
  fetcher: async ({ chatId }: { chatId: string }) => {
    const createdAtTimeGte = dayjs.utc(new Date()).startOf('day')

    const createdAtTimeLte = createdAtTimeGte.add(1, 'day').toString()

    const res = await datahubQueryRequest<
      {
        posts: {
          total: number
        }
      },
      {
        createdAtTimeGte: string
        createdAtTimeLte: string
        postId: string
      }
    >({
      document: GET_POSTS_COUNT_BY_TODAY,
      variables: {
        postId: chatId,
        createdAtTimeGte: createdAtTimeGte.toString(),
        createdAtTimeLte: createdAtTimeLte,
      },
    })
    return res.posts.total
  },
  defaultConfigGenerator: (params) => ({
    enabled: !!params?.chatId,
  }),
})

const GET_TOP_MEMES = gql`
  query GetTopMemes($timestamp: String!) {
    activeStakingRankedPostIdsBySuperLikesNumber(
      args: {
        filter: { period: DAY, timestamp: $timestamp }
        limit: 5
        offset: 0
        order: DESC
      }
    ) {
      data {
        postId
        score
        rank
      }
      total
    }
  }
`
export const getTopMemesQuery = createQuery({
  key: 'getTopMemes',
  fetcher: async () => {
    const timestamp = dayjs.utc(new Date()).startOf('day').unix().toString()

    const res = await datahubQueryRequest<
      {
        activeStakingRankedPostIdsBySuperLikesNumber: {
          data: {
            postId: string
            score: number
            rank: number
          }[]
          total: number
        }
      },
      {
        timestamp: string
      }
    >({
      document: GET_TOP_MEMES,
      variables: {
        timestamp: timestamp,
      },
    })
    return res.activeStakingRankedPostIdsBySuperLikesNumber.data
  },
  defaultConfigGenerator: () => ({
    enabled: true,
  }),
})

const TOP_MEMES_SIZE = 5

export const useGetTopMemes = () => {
  const { data, isLoading } = getTopMemesQuery.useQuery({})

  const dataLength = data?.length || 0

  const topMemesIds = data?.map((item) => item.postId) || []

  const {
    messageIds,
    isLoading: isLastMemesLoading,
    loadMore,
  } = usePaginatedMessageIds({
    hubId: env.NEXT_PUBLIC_MAIN_SPACE_ID,
    chatId: env.NEXT_PUBLIC_MAIN_CHAT_ID,
    onlyDisplayUnapprovedMessages: false,
  })

  useEffect(() => {
    if (isEmptyArray(messageIds) && dataLength < TOP_MEMES_SIZE) {
      loadMore()
    }
  }, [loadMore, messageIds, dataLength])

  return {
    isLoading: isLoading && isLastMemesLoading,
    data:
      dataLength < TOP_MEMES_SIZE
        ? Array.from(
            new Set([...topMemesIds, ...messageIds.slice(0, 5 - dataLength)])
          )
        : topMemesIds,
  }
}
