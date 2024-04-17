import { gql } from 'graphql-request'
import { getPostsFromDatahub } from '../../datahub/posts/fetcher'

export const getPosts = getPostsFromDatahub

// TODO: update to datahub impl
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
export async function getPostIdsBySpaceIds(spaceIds: string[]) {
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
