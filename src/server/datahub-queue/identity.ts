import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  LinkIdentityMutation,
  LinkIdentityMutationVariables,
} from './generated'
import { backendSigWrapper, datahubQueueRequest } from './utils'

const LINK_IDENTITY_MUTATION = gql`
  mutation LinkIdentity(
    $createLinkedIdentityInput: CreateMutateLinkedIdentityInput!
  ) {
    createLinkedIdentity(
      createLinkedIdentityInput: $createLinkedIdentityInput
    ) {
      processed
      message
    }
  }
`

export async function linkIdentity(input: SocialEventDataApiInput) {
  await backendSigWrapper(input)
  const res = await datahubQueueRequest<
    LinkIdentityMutation,
    LinkIdentityMutationVariables
  >({
    document: LINK_IDENTITY_MUTATION,
    variables: {
      createLinkedIdentityInput: input as any,
    },
  })
  if (!res.createLinkedIdentity.processed) {
    throw new Error(
      res.createLinkedIdentity.message ?? 'Failed to link identity'
    )
  }
}
