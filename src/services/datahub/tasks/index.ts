import { gql } from 'graphql-request'
import {
  GetGamificationTasksQuery,
  GetGamificationTasksQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_GAMIFICATION_TASKS = gql`
  query GetGamificationTasks($address: String!, $rootSpaceId: String!) {
    gamificationTasks(
      args: { filter: { address: $address, rootSpaceId: $rootSpaceId } }
    ) {
      data {
        rewardPoints
        id
        name
        tag
        createdAt
        completed
        claimed
        linkedIdentity {
          id
        }
        metadata {
          telegramChannelToJoin
          twitterChannelToJoin
          likesNumberToAchieve
          referralsNumberToAchieve
        }
      }
      total
    }
  }
`

export type GamificationTask =
  GetGamificationTasksQuery['gamificationTasks']['data'][0]

export async function getGamificationTasks({
  address,
  rootSpaceId,
}: {
  address: string
  rootSpaceId: string
}) {
  const res = await datahubQueryRequest<
    GetGamificationTasksQuery,
    GetGamificationTasksQueryVariables
  >({
    document: GET_GAMIFICATION_TASKS,
    variables: { address, rootSpaceId },
  })

  return res.gamificationTasks
}
