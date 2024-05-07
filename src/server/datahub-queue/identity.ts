import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  LinkIdentityEvmMessageMutation,
  LinkIdentityEvmMessageMutationVariables,
  LinkIdentityMutation,
  LinkIdentityMutationVariables,
} from './generated'
import {
  backendSigWrapper,
  datahubQueueRequest,
  throwErrorIfNotProcessed,
} from './utils'

const LINK_IDENTITY_MUTATION = gql`
  mutation LinkIdentity($args: CreateMutateLinkedIdentityInput!) {
    initLinkedIdentity(args: $args) {
      processed
      callId
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
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(res.initLinkedIdentity, 'Failed to link identity')
}

const LINK_IDENTITY_EVM_MESSAGE = gql`
  mutation LinkIdentityEvmMessage($address: String!) {
    linkedIdentityExternalProviderEvmProofMsg(address: $address) {
      message
    }
  }
`

export async function getLinkIdentityMessage(address: string) {
  const res = await datahubQueueRequest<
    LinkIdentityEvmMessageMutation,
    LinkIdentityEvmMessageMutationVariables
  >({
    document: LINK_IDENTITY_EVM_MESSAGE,
    variables: { address },
  })
  return res.linkedIdentityExternalProviderEvmProofMsg.message
}
