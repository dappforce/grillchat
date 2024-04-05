import { gql } from 'graphql-request'
import { datahubQueryRequest } from '../utils'

const GET_HOT_POSTS = gql`
  query GetHotPosts($limit: Int!, $offset: Int!) {
    activeStakingRankedPostIdsByActiveStakingActivity(
      args: { limit: $limit, offset: $offset }
    ) {
      data {
        persistentPostId
      }
      total
    }
  }
`

export async function getHotPosts(variables: {
  offset: number
  limit: number
}) {
  const res = await datahubQueryRequest<
    {
      activeStakingRankedPostIdsByActiveStakingActivity: {
        data: {
          persistentPostId: string
        }[]
        total: number
      }
    },
    { limit: number; offset: number }
  >({
    document: GET_HOT_POSTS,
    variables,
  })

  return res.activeStakingRankedPostIdsByActiveStakingActivity
}
