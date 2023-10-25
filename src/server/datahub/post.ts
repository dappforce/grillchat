import { gql } from 'graphql-request'
import {
  CreatePostOptimisticInput,
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  NotifyCreatePostTxFailedOrRetryStatusMutation,
  NotifyCreatePostTxFailedOrRetryStatusMutationVariables,
  NotifyUpdatePostTxFailedOrRetryStatusMutation,
  NotifyUpdatePostTxFailedOrRetryStatusMutationVariables,
  UpdatePostBlockchainSyncStatusInput,
  UpdatePostOptimisticInput,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from './generated-mutation'
import { datahubMutationRequest } from './utils'

const CREATE_POST_OPTIMISTIC_MUTATION = gql`
  mutation CreatePostOptimistic(
    $createPostOptimisticInput: CreatePostOptimisticInput!
  ) {
    createPostOptimistic(
      createPostOptimisticInput: $createPostOptimisticInput
    ) {
      message
    }
  }
`
export async function createPostData(input: CreatePostOptimisticInput) {
  await datahubMutationRequest<
    CreatePostOptimisticMutation,
    CreatePostOptimisticMutationVariables
  >({
    document: CREATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      createPostOptimisticInput: input,
    },
  })
}

const UPDATE_POST_OPTIMISTIC_MUTATION = gql`
  mutation UpdatePostOptimistic(
    $updatePostOptimisticInput: UpdatePostOptimisticInput!
  ) {
    updatePostOptimistic(
      updatePostOptimisticInput: $updatePostOptimisticInput
    ) {
      message
    }
  }
`
export async function updatePostData(input: UpdatePostOptimisticInput) {
  await datahubMutationRequest<
    UpdatePostOptimisticMutation,
    UpdatePostOptimisticMutationVariables
  >({
    document: UPDATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      updatePostOptimisticInput: input,
    },
  })
}

const NOTIFY_CREATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION = gql`
  mutation NotifyCreatePostTxFailedOrRetryStatus(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      message
    }
  }
`
export async function notifyCreatePostFailedOrRetryStatus(
  input: UpdatePostBlockchainSyncStatusInput
) {
  await datahubMutationRequest<
    NotifyCreatePostTxFailedOrRetryStatusMutation,
    NotifyCreatePostTxFailedOrRetryStatusMutationVariables
  >({
    document: NOTIFY_CREATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION,
    variables: {
      updatePostBlockchainSyncStatusInput: input,
    },
  })
}

const NOTIFY_UPDATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION = gql`
  mutation NotifyUpdatePostTxFailedOrRetryStatus(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      message
    }
  }
`
export async function notifyUpdatePostFailedOrRetryStatus(
  input: UpdatePostBlockchainSyncStatusInput
) {
  await datahubMutationRequest<
    NotifyUpdatePostTxFailedOrRetryStatusMutation,
    NotifyUpdatePostTxFailedOrRetryStatusMutationVariables
  >({
    document: NOTIFY_UPDATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION,
    variables: {
      updatePostBlockchainSyncStatusInput: input,
    },
  })
}
