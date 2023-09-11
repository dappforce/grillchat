import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetMessageIdsInChatIdQuery,
  GetMessageIdsInChatIdQueryVariables,
  QueryOrder,
} from '../generated'
import { datahubRequest } from '../utils'
import { useSubscribeCommentIdsByPostId } from './subscription'

const GET_MESSAGE_IDS_IN_CHAT_ID = gql`
  query GetMessageIdsInChatId($where: FindPostsArgs!) {
    findPosts(where: $where) {
      id
      persistentId
    }
  }
`

async function getCommentIdsByPostIds(postId: string) {
  const res = await datahubRequest<
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

const getCommentIdsByPostIdQueryRaw = createQuery({
  key: 'commentIdsByPostId',
  fetcher: getCommentIdsByPostIds,
})
export const getCommentIdsByPostIdQuery: typeof getCommentIdsByPostIdQueryRaw & {
  useQuerySubscription: (typeof getCommentIdsByPostIdQueryRaw)['useQuery']
  useQueriesSubscription: (typeof getCommentIdsByPostIdQueryRaw)['useQueries']
} = {
  ...getCommentIdsByPostIdQueryRaw,
  useQuerySubscription: (...args) => {
    useSubscribeCommentIdsByPostId()
    return getCommentIdsByPostIdQueryRaw.useQuery(...args)
  },
  useQueriesSubscription: (...args) => {
    useSubscribeCommentIdsByPostId()
    return getCommentIdsByPostIdQueryRaw.useQueries(...args)
  },
}
