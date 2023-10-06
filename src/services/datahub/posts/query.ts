import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetMessageIdsInChatIdQuery,
  GetMessageIdsInChatIdQueryVariables,
  QueryOrder,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_MESSAGE_IDS_IN_CHAT_ID = gql`
  query GetMessageIdsInChatId($where: FindPostsArgs!) {
    findPosts(where: $where) {
      id
      persistentId
    }
  }
`

async function getCommentIdsByPostIds(postId: string) {
  const res = await datahubQueryRequest<
    GetMessageIdsInChatIdQuery,
    GetMessageIdsInChatIdQueryVariables
  >({
    document: GET_MESSAGE_IDS_IN_CHAT_ID,
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

export const getCommentIdsByPostIdQuery = createQuery({
  key: 'commentIdsByPostId',
  fetcher: getCommentIdsByPostIds,
})
