import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetMessageIdsInChatIdQuery,
  GetMessageIdsInChatIdQueryVariables,
  QueryOrder,
} from '../generated'
import { datahubRequest } from '../utils'
import {
  useSubscribeCommentIdsByPostId,
  useSubscribeCommentIdsByPostIds,
} from './subscription'

const GET_MESSAGE_IDS_IN_CHAT_ID = gql`
  query GetMessageIdsInChatId($where: FindPostsArgs!) {
    findPosts(where: $where) {
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
  return res.findPosts.map((post) => post.persistentId)
}

const getCommentIdsByPostIdQueryPlain = createQuery({
  key: 'commentIdsByPostId',
  fetcher: getCommentIdsByPostIds,
})
export const getCommentIdsByPostIdQuery: typeof getCommentIdsByPostIdQueryPlain & {
  useQuerySubscription: (typeof getCommentIdsByPostIdQueryPlain)['useQuery']
  useQueriesSubscription: (typeof getCommentIdsByPostIdQueryPlain)['useQueries']
} = {
  ...getCommentIdsByPostIdQueryPlain,
  useQuerySubscription: (...args) => {
    const [data] = args
    useSubscribeCommentIdsByPostId(data, true)
    return getCommentIdsByPostIdQueryPlain.useQuery(...args)
  },
  useQueriesSubscription: (...args) => {
    const [data] = args
    useSubscribeCommentIdsByPostIds(data, true)
    return getCommentIdsByPostIdQueryPlain.useQueries(...args)
  },
}
