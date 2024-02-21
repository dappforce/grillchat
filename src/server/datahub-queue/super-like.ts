import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import {
  SocialCallDataArgs,
  SocialEventDataApiInput,
} from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  CreateSuperLikeMutation,
  CreateSuperLikeMutationVariables,
} from './generated'
import {
  backendSigWrapper,
  datahubQueueRequest,
  throwErrorIfNotProcessed,
} from './utils'

const GET_SUPER_LIKE_CONFIRMATION_MSG = gql`
  query GetSuperLikeConfirmationMsg {
    activeStakingConfirmationMessage {
      message
      week
    }
  }
`
export async function getSuperLikeConfirmationMsg() {
  const res = await datahubQueueRequest<
    {
      activeStakingConfirmationMessage: {
        message: string
      }
    },
    {}
  >({
    document: GET_SUPER_LIKE_CONFIRMATION_MSG,
    variables: {},
  })

  return {
    message: res.activeStakingConfirmationMessage.message ?? '',
  }
}

const CREATE_SUPER_LIKE = gql`
  mutation CreateSuperLike(
    $createSuperLikeInput: CreateMutateActiveStakingSuperLikeInput!
  ) {
    activeStakingCreateSuperLike(args: $createSuperLikeInput) {
      processed
      message
    }
  }
`
export async function createSuperLike(input: SocialEventDataApiInput) {
  const args: SocialCallDataArgs<'synth_active_staking_create_super_like'> =
    JSON.parse(input.callData?.args || '{}') as any
  const substrateApi = await (await getSubsocialApi()).substrateApi
  const blockHash = await substrateApi.rpc.chain.getBlockHash()

  args.blockHash = blockHash.toString()
  input.callData.args = JSON.stringify(args)

  input.callData.timestamp = Date.now()

  const signedPayload = await backendSigWrapper(input)
  const res = await datahubQueueRequest<
    CreateSuperLikeMutation,
    CreateSuperLikeMutationVariables
  >({
    document: CREATE_SUPER_LIKE,
    variables: {
      createSuperLikeInput: signedPayload as any,
    },
  })
  throwErrorIfNotProcessed(
    res.activeStakingCreateSuperLike,
    'Failed to create super like'
  )
}
