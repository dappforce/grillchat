import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import { POST_FRAGMENT } from '../squid/fragments'
import { GetPostsQuery, GetPostsQueryVariables } from '../squid/generated'
import { mapPostFragment } from '../squid/mappers'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils'

async function getPostsFromBlockchain({
  api,
  data: postIds,
}: SubsocialQueryData<string[]>) {
  if (postIds.length === 0) return []
  const res = await api.findPosts({ ids: postIds, visibility: 'onlyPublic' })
  return res
}

const GET_POSTS = gql`
  ${POST_FRAGMENT}
  query getPosts($ids: [String!]) {
    posts(where: { id_in: $ids, hidden_eq: false }) {
      ...PostFragment
    }
  }
`
async function getPostsFromSquid(postIds: string[]) {
  if (postIds.length === 0) return []
  const res = await squidRequest<GetPostsQuery, GetPostsQueryVariables>({
    document: GET_POSTS,
    variables: { ids: postIds },
  })
  return res.posts.map((post) => mapPostFragment(post))
}

export const getPostsFromSubsocial = standaloneDynamicFetcherWrapper({
  blockchain: getPostsFromBlockchain,
  squid: getPostsFromSquid,
})
