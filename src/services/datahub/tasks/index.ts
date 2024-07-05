import { gql } from 'graphql-request'
import { datahubQueryRequest } from '../utils'

const GET_GAMIFICATION_TASKS = gql`
  query GetGamificationTasks($address: String!) {
    gamificationTasks(args: { filter: { address: $address } }) {
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
      }
      total
    }
  }
`

export type GamificationTask = {
  rewardPoints: string
  id: string
  name: string
  tag: string
  createdAt: string
  completed: boolean
  claimed: boolean
  linkedIdentity: { id: string }
}

export async function getGamificationTasks(address: string) {
  const res = await datahubQueryRequest<
    {
      gamificationTasks: {
        data: GamificationTask[]
        total: number
      }
    },
    { address: string }
  >({
    document: GET_GAMIFICATION_TASKS,
    variables: { address },
  })

  return res.gamificationTasks
}
