import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  GamificationClaimTaskMutation,
  GamificationClaimTaskMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const CLAIM_TASKS_TOKENS = gql`
  mutation GamificationClaimTask($args: CreateMutateGamificationEntityInput!) {
    gamificationClaimTask(args: $args) {
      processed
      callId
      message
    }
  }
`

export async function claimTasksTokens(input: SocialEventDataApiInput) {
  const res = await datahubQueueRequest<
    GamificationClaimTaskMutation,
    GamificationClaimTaskMutationVariables
  >({
    document: CLAIM_TASKS_TOKENS,
    variables: {
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(
    res.gamificationClaimTask,
    'Failed to claim tasks tokens'
  )
}
