import { gql } from 'graphql-request'
import {
  CreateMutateSpaceOffChainDataInput,
  CreateSpaceOffChainMutation,
  CreateSpaceOffChainMutationVariables,
  UpdatePostOptimisticInput,
  UpdateSpaceOffChainMutation,
  UpdateSpaceOffChainMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const CREATE_SPACE_OFFCHAIN_MUTATION = gql`
  mutation CreateSpaceOffChain(
    $createSpaceOffChainInput: CreateMutateSpaceOffChainDataInput!
  ) {
    createSpaceOffChain(args: $createSpaceOffChainInput) {
      processed
      message
    }
  }
`
export async function createSpaceServer(
  input: CreateMutateSpaceOffChainDataInput
) {
  const res = await datahubQueueRequest<
    CreateSpaceOffChainMutation,
    CreateSpaceOffChainMutationVariables
  >({
    document: CREATE_SPACE_OFFCHAIN_MUTATION,
    variables: {
      createSpaceOffChainInput: input,
    },
  })
  throwErrorIfNotProcessed(res.createSpaceOffChain, 'Failed to create space')
}

const UPDATE_SPACE_OFFCHAIN_MUTATION = gql`
  mutation UpdateSpaceOffChain(
    $updateSpaceOffChainInput: CreateMutateSpaceOffChainDataInput!
  ) {
    updateSpaceOffChain(args: $updateSpaceOffChainInput) {
      processed
      message
    }
  }
`
export async function updateSpaceServer(input: UpdatePostOptimisticInput) {
  const res = await datahubQueueRequest<
    UpdateSpaceOffChainMutation,
    UpdateSpaceOffChainMutationVariables
  >({
    document: UPDATE_SPACE_OFFCHAIN_MUTATION,
    variables: {
      updateSpaceOffChainInput: input,
    },
  })
  throwErrorIfNotProcessed(res.updateSpaceOffChain, 'Failed to update space')
}
