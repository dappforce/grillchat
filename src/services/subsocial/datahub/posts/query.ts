import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetCommentIdsInPostIdQuery,
  GetCommentIdsInPostIdQueryVariables,
  GetLastCommentIdQuery,
  GetLastCommentIdQueryVariables,
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

async function getCommentIdsByPostIds(postId: string) {
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
  return res.findPosts.map((post) => post.persistentId || post.id)
}

export const getCommentIdsByPostIdFromDatahubQuery = createQuery({
  key: 'comments',
  fetcher: getCommentIdsByPostIds,
})

const GET_LAST_COMMENT_ID = gql`
  query GetLastCommentId($where: LatestCommentsInput!) {
    latestComments(where: $where) {
      commentData {
        id
        persistentId
        rootPostPersistentId
      }
    }
  }
`

const getLastCommentId = poolQuery<string, string>({
  multiCall: async (data) => {
    const res = await datahubQueryRequest<
      GetLastCommentIdQuery,
      GetLastCommentIdQueryVariables
    >({
      document: GET_LAST_COMMENT_ID,
      variables: {
        where: { persistentIds: data },
      },
    })
    const latestComments = res.latestComments
    return data.map((chatId) => {
      const comment = latestComments.find(
        (comment) => comment.commentData.rootPostPersistentId === chatId
      )?.commentData
      return comment?.persistentId || comment?.id || ''
    })
  },
})

export const getLastCommentIdQuery = createQuery({
  key: 'last-comment-id',
  fetcher: getLastCommentId,
})
