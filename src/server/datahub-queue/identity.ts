import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  AddExternalProviderToIdentityMutation,
  AddExternalProviderToIdentityMutationVariables,
  LinkIdentityEvmMessageMutation,
  LinkIdentityEvmMessageMutationVariables,
  LinkIdentityMutation,
  LinkIdentityMutationVariables,
  UpdateExternalProviderMutation,
  UpdateExternalProviderMutationVariables,
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

const ADD_EXTERNAL_PROVIDER_TO_IDENTITY_MUTATION = gql`
  mutation AddExternalProviderToIdentity(
    $args: CreateMutateLinkedIdentityInput!
  ) {
    addNewLinkedIdentityExternalProvider(args: $args) {
      processed
      callId
      message
    }
  }
`

export async function addExternalProviderToIdentity(
  input: SocialEventDataApiInput
) {
  const res = await datahubQueueRequest<
    AddExternalProviderToIdentityMutation,
    AddExternalProviderToIdentityMutationVariables
  >({
    document: ADD_EXTERNAL_PROVIDER_TO_IDENTITY_MUTATION,
    variables: {
      args: input as any,
    },
  })

  throwErrorIfNotProcessed(
    res.addNewLinkedIdentityExternalProvider,
    'Failed to add external provider to identity'
  )
}

const UPDATE_EXTERNAL_PROVIDER = gql`
  mutation UpdateExternalProvider($args: CreateMutateLinkedIdentityInput!) {
    updateLinkedIdentityExternalProvider(args: $args) {
      processed
      callId
      message
    }
  }
`

export async function updateExternalProvider(input: SocialEventDataApiInput) {
  const res = await datahubQueueRequest<
    UpdateExternalProviderMutation,
    UpdateExternalProviderMutationVariables
  >({
    document: UPDATE_EXTERNAL_PROVIDER,
    variables: {
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(
    res.updateLinkedIdentityExternalProvider,
    'Failed to update external provider'
  )
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
