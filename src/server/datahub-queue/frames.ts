import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  CreateFramesLikeMutation,
  CreateFramesLikeMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const CREATE_FRAMES_LIKE = gql`
  mutation CreateFramesLike($args: CreateMutateActiveStakingSuperLikeInput!) {
    activeStakingCreateFarcasterFrameLike(args: $args) {
      processed
      callId
      message
    }
  }
`
export async function createFramesLike(input: SocialEventDataApiInput) {
  const res = await datahubQueueRequest<
    CreateFramesLikeMutation,
    CreateFramesLikeMutationVariables
  >({
    document: CREATE_FRAMES_LIKE,
    variables: {
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(
    res.activeStakingCreateFarcasterFrameLike,
    'Failed to create frames like'
  )
}
