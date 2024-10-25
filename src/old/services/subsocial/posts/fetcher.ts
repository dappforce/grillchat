import { SubsocialQueryData } from '@/old/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import { getPostsFromDatahub } from '../../datahub/posts/fetcher'
import { POST_FRAGMENT } from '../squid/fragments'
import {
  GetPostIdsBySpaceIdsQuery,
  GetPostIdsBySpaceIdsQueryVariables,
  GetPostsFollowersCountQuery,
  GetPostsFollowersCountQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from '../squid/generated'
import { mapPostFragment } from '../squid/mappers'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils/service-mapper'

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

const GET_POST_IDS_BY_SPACE_IDS = gql`
  query GetPostIdsBySpaceIds($ids: [String!]) {
    posts(where: { space: { id_in: $ids } }) {
      id
      space {
        id
      }
    }
  }
`
async function getPostIdsBySpaceIdsFromSquid(spaceIds: string[]) {
  const res = await squidRequest<
    GetPostIdsBySpaceIdsQuery,
    GetPostIdsBySpaceIdsQueryVariables
  >({
    document: GET_POST_IDS_BY_SPACE_IDS,
    variables: { ids: spaceIds },
  })
  const postIdsBySpaceId: Record<
    string,
    { spaceId: string; postIds: string[] }
  > = {}
  res.posts.forEach((post) => {
    const spaceId = post.space?.id
    if (!spaceId) return
    if (!postIdsBySpaceId[spaceId])
      postIdsBySpaceId[spaceId] = { postIds: [], spaceId }
    postIdsBySpaceId[spaceId].postIds.push(post.id)
  })
  return Object.values(postIdsBySpaceId)
}
async function getPostIdsBySpaceIdsFromBlockchain({
  api,
  data: spaceIds,
}: SubsocialQueryData<string[]>) {
  const res = await Promise.all(
    spaceIds.map((spaceId) => api.blockchain.postIdsBySpaceId(spaceId))
  )
  return res.map((postIds, i) => ({
    spaceId: spaceIds[i],
    postIds,
  }))
}
export const getPostIdsBySpaceIdsFromSubsocial =
  standaloneDynamicFetcherWrapper({
    blockchain: getPostIdsBySpaceIdsFromBlockchain,
    squid: getPostIdsBySpaceIdsFromSquid,
  })
