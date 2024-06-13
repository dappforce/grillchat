import {
  SocialCallDataArgs,
  SocialEventDataApiInput,
} from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  ClaimDailyRewardMutation,
  ClaimDailyRewardMutationVariables,
} from './generated'
import {
  backendSigWrapper,
  datahubQueueRequest,
  throwErrorIfNotProcessed,
} from './utils'

const CLAIM_DAILY_REWARD = gql`
  mutation ClaimDailyReward($args: CreateMutateGamificationEntityInput!) {
    claimEntranceDailyReward(args: $args) {
      processed
      message
    }
  }
`
export async function claimDailyReward(input: SocialEventDataApiInput) {
  const args: SocialCallDataArgs<'synth_gamification_claim_entrance_daily_reward'> =
    JSON.parse(input.callData?.args || '{}') as any

  input.callData.args = JSON.stringify(args)
  input.callData.timestamp = Date.now()

  const signedPayload = await backendSigWrapper(input)
  const res = await datahubQueueRequest<
    ClaimDailyRewardMutation,
    ClaimDailyRewardMutationVariables
  >({
    document: CLAIM_DAILY_REWARD,
    variables: {
      args: signedPayload as any,
    },
  })
  throwErrorIfNotProcessed(
    res.claimEntranceDailyReward,
    'Failed to claim daily reward'
  )
}
