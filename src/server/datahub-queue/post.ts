import { gql } from 'graphql-request'
import {
  CanAccountDoArgsInput,
  CreatePostOptimisticInput,
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  GetCanAccountDoQuery,
  GetCanAccountDoQueryVariables,
  NotifyCreatePostTxFailedOrRetryStatusMutation,
  NotifyCreatePostTxFailedOrRetryStatusMutationVariables,
  NotifyUpdatePostTxFailedOrRetryStatusMutation,
  NotifyUpdatePostTxFailedOrRetryStatusMutationVariables,
  UpdatePostBlockchainSyncStatusInput,
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

const CREATE_POST_OPTIMISTIC_MUTATION = gql`
  mutation CreatePostOptimistic(
    $createPostOptimisticInput: CreatePostOptimisticInput!
  ) {
    createPostOptimistic(
      createPostOptimisticInput: $createPostOptimisticInput
    ) {
      processed
      message
    }
  }
`
export async function createPostData(input: CreatePostOptimisticInput) {
  const res = await datahubQueueRequest<
    CreatePostOptimisticMutation,
    CreatePostOptimisticMutationVariables
  >({
    document: CREATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      createPostOptimisticInput: input,
    },
  })
  throwErrorIfNotProcessed(res.createPostOptimistic, 'Failed to create post')
}

const UPDATE_POST_OPTIMISTIC_MUTATION = gql`
  mutation UpdatePostOptimistic(
    $updatePostOptimisticInput: UpdatePostOptimisticInput!
  ) {
    updatePostOptimistic(
      updatePostOptimisticInput: $updatePostOptimisticInput
    ) {
      processed
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
}

const NOTIFY_CREATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION = gql`
  mutation NotifyCreatePostTxFailedOrRetryStatus(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      processed
      message
    }
  }
`
export async function notifyCreatePostFailedOrRetryStatus(
  input: UpdatePostBlockchainSyncStatusInput
) {
  const res = await datahubQueueRequest<
    NotifyCreatePostTxFailedOrRetryStatusMutation,
    NotifyCreatePostTxFailedOrRetryStatusMutationVariables
  >({
    document: NOTIFY_CREATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION,
    variables: {
      updatePostBlockchainSyncStatusInput: input,
    },
  })
  throwErrorIfNotProcessed(
    res.updatePostBlockchainSyncStatus,
    'Failed to notify create post'
  )
}

const NOTIFY_UPDATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION = gql`
  mutation NotifyUpdatePostTxFailedOrRetryStatus(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      processed
      message
    }
  }
`
export async function notifyUpdatePostFailedOrRetryStatus(
  input: UpdatePostBlockchainSyncStatusInput
) {
  const res = await datahubQueueRequest<
    NotifyUpdatePostTxFailedOrRetryStatusMutation,
    NotifyUpdatePostTxFailedOrRetryStatusMutationVariables
  >({
    document: NOTIFY_UPDATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION,
    variables: {
      updatePostBlockchainSyncStatusInput: input,
    },
  })
  throwErrorIfNotProcessed(
    res.updatePostBlockchainSyncStatus,
    'Failed to notify update post'
  )
}
