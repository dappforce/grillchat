import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  ClaimDailyRewardMutation,
  ClaimDailyRewardMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const CLAIM_DAILY_REWARD = gql`
  mutation ClaimDailyReward($args: CreateMutateGamificationEntityInput!) {
    claimEntranceDailyReward(args: $args) {
      processed
      message
    }
  }
`
export async function claimDailyReward(input: SocialEventDataApiInput) {
  const res = await datahubQueueRequest<
    ClaimDailyRewardMutation,
    ClaimDailyRewardMutationVariables
  >({
    document: CLAIM_DAILY_REWARD,
    variables: {
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(
    res.claimEntranceDailyReward,
    'Failed to claim daily reward'
  )
}
