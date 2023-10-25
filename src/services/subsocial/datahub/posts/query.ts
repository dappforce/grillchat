import { getPostQuery } from '@/services/api/query'
import { queryClient } from '@/services/provider'
import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import { commentIdsOptimisticEncoder } from '../../commentIds/optimistic'
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
      id
      persistentId
    }
  }
`
async function getCommentIdsByPostIds(postId: string): Promise<string[]> {
  const res = await datahubQueryRequest<
    GetCommentIdsInPostIdQuery,
    GetCommentIdsInPostIdQueryVariables
  >({
    document: GET_COMMENT_IDS_IN_POST_ID,
    variables: {
      where: {
        rootPostPersistentId: postId,
        orderBy: 'createdAtTime',
        orderDirection: QueryOrder.Asc,
      },
    },
  })
  const ids = res.findPosts.map((post) => post.persistentId || post.id)
  const oldIds = getCommentIdsByPostIdFromDatahubQuery.getQueryData(
    queryClient,
    postId
  )
  const oldOptimisticIds =
    oldIds?.filter((id) => commentIdsOptimisticEncoder.checker(id)) || []
  return [...ids, ...oldOptimisticIds]
}
export const getCommentIdsByPostIdFromDatahubQuery = createQuery({
  key: 'comments',
  fetcher: getCommentIdsByPostIds,
  defaultConfigGenerator: () => ({
    refetchOnWindowFocus: true,
    staleTime: 0,
  }),
})

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
