import { gql } from 'graphql-request'
import {
  ApproveMessageMutation,
  ApproveMessageMutationVariables,
  ApproveUserMutation,
  ApproveUserMutationVariables,
  CanAccountDoArgsInput,
  CreatePostOffChainInput,
  CreatePostOffChainMutation,
  CreatePostOffChainMutationVariables,
  GetCanAccountDoQuery,
  GetCanAccountDoQueryVariables,
  SocialProfileAddReferrerIdInput,
  UpdatePostOptimisticInput,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const GET_CAN_ACCOUNT_DO = gql`
  query GetCanAccountDo($getAccountDo: CanAccountDoArgsInput!) {
    canAccountDo(args: $getAccountDo) {
      isAllowed
    }
  }
`
export async function getCanAccountDo(input: CanAccountDoArgsInput) {
  const { canAccountDo } = await datahubQueueRequest<
    GetCanAccountDoQuery,
    GetCanAccountDoQueryVariables
  >({
    document: GET_CAN_ACCOUNT_DO,
    variables: {
      getAccountDo: input,
    },
  })
  return canAccountDo.isAllowed
}

const CREATE_POST_OFFCHAIN_MUTATION = gql`
  mutation CreatePostOffChain(
    $createPostOffChainInput: CreatePostOffChainInput!
  ) {
    createPostOffChain(createPostOffChainInput: $createPostOffChainInput) {
      processed
      callId
      message
    }
  }
`
export async function createPostData(input: CreatePostOffChainInput) {
  const res = await datahubQueueRequest<
    CreatePostOffChainMutation,
    CreatePostOffChainMutationVariables
  >({
    document: CREATE_POST_OFFCHAIN_MUTATION,
    variables: {
      createPostOffChainInput: input,
    },
  })
  throwErrorIfNotProcessed(res.createPostOffChain, 'Failed to create post')
  return res.createPostOffChain.callId
}

const UPDATE_POST_OPTIMISTIC_MUTATION = gql`
  mutation UpdatePostOptimistic(
    $updatePostOptimisticInput: UpdatePostOptimisticInput!
  ) {
    updatePostOptimistic(
      updatePostOptimisticInput: $updatePostOptimisticInput
    ) {
      processed
      callId
      message
    }
  }
`
export async function updatePostData(input: UpdatePostOptimisticInput) {
  const res = await datahubQueueRequest<
    UpdatePostOptimisticMutation,
    UpdatePostOptimisticMutationVariables
  >({
    document: UPDATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      updatePostOptimisticInput: input,
    },
  })
  throwErrorIfNotProcessed(res.updatePostOptimistic, 'Failed to update post')
  return res.updatePostOptimistic.callId
}

const APPROVE_USER_MUTATION = gql`
  mutation ApproveUser($input: SocialProfileAddReferrerIdInput!) {
    socialProfileSetActionPermissions(args: $input) {
      processed
      callId
      message
    }
  }
`
export async function approveUser(input: SocialProfileAddReferrerIdInput) {
  const res = await datahubQueueRequest<
    ApproveUserMutation,
    ApproveUserMutationVariables
  >({
    document: APPROVE_USER_MUTATION,
    variables: {
      input,
    },
  })
  throwErrorIfNotProcessed(
    res.socialProfileSetActionPermissions,
    'Failed to approve user'
  )
  return res.socialProfileSetActionPermissions.callId
}

const APPROVE_MESSAGE_MUTATION = gql`
  mutation ApproveMessage($input: CreateMutatePostOffChainDataInput!) {
    setPostApproveStatus(args: $input) {
      processed
      callId
      message
    }
  }
`
export async function approveMessage(input: SocialProfileAddReferrerIdInput) {
  const res = await datahubQueueRequest<
    ApproveMessageMutation,
    ApproveMessageMutationVariables
  >({
    document: APPROVE_MESSAGE_MUTATION,
    variables: {
      input,
    },
  })
  throwErrorIfNotProcessed(
    res.setPostApproveStatus,
    'Failed to approve message'
  )
  return res.setPostApproveStatus.callId
}
