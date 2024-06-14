import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  LinkIdentityMutation,
  LinkIdentityMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const SAVE_POINTS_AND_ENERGY = gql`
  mutation LinkIdentity($args: CreateMutateLinkedIdentityInput!) {
    initLinkedIdentity(args: $args) {
      processed
      callId
      message
    }
  }
`

export async function savePointsAndEnergy(input: SocialEventDataApiInput) {
  const res = await datahubQueueRequest<
    LinkIdentityMutation,
    LinkIdentityMutationVariables
  >({
    document: SAVE_POINTS_AND_ENERGY,
    variables: {
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(
    res.initLinkedIdentity,
    'Failed to save points and energy'
  )
}
