import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import { getPostsFromDatahub } from '../datahub/posts/fetcher'
import { POST_FRAGMENT } from '../squid/fragments'
import {
  GetPostsFollowersCountQuery,
  GetPostsFollowersCountQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from '../squid/generated'
import { mapPostFragment } from '../squid/mappers'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils'

async function getPostsFromBlockchain({
  api,
  data: postIds,
}: SubsocialQueryData<string[]>) {
  if (postIds.length === 0) return []
  const res = await api.findPosts({ ids: postIds })
  return res
}

const GET_POSTS = gql`
  ${POST_FRAGMENT}
  query GetPosts($ids: [String!]) {
    posts(where: { id_in: $ids }) {
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
  datahub: getPostsFromDatahub,
})

const GET_POSTS_FOLLOWERS_COUNT = gql`
  query GetPostsFollowersCount($ids: [String!]) {
    posts(where: { id_in: $ids }) {
      id
      followersCount
    }
  }
`
export async function getPostsFollowersCountFromSquid(postIds: string[]) {
  if (postIds.length === 0) return []
  const res = await squidRequest<
    GetPostsFollowersCountQuery,
    GetPostsFollowersCountQueryVariables
  >({
    document: GET_POSTS_FOLLOWERS_COUNT,
    variables: { ids: postIds },
  })
  return res.posts
}
