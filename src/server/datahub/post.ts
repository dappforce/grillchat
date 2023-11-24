import { gql } from 'graphql-request'
import {
  CanAccountDoArgsInput,
  CreateMutateLinkedIdentityInput,
  CreatePostOptimisticInput,
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  GetCanAccountDoQuery,
  GetCanAccountDoQueryVariables,
  LinkIdentityMutation,
  LinkIdentityMutationVariables,
  NotifyCreatePostTxFailedOrRetryStatusMutation,
  NotifyCreatePostTxFailedOrRetryStatusMutationVariables,
  NotifyUpdatePostTxFailedOrRetryStatusMutation,
  NotifyUpdatePostTxFailedOrRetryStatusMutationVariables,
  UpdatePostBlockchainSyncStatusInput,
  UpdatePostOptimisticInput,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from './generated'
import { backendSigWrapper, datahubQueueRequest } from './utils'

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
      message
    }
  }
`
export async function createPostData(input: CreatePostOptimisticInput) {
  await datahubQueueRequest<
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
  await datahubQueueRequest<
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
  await datahubQueueRequest<
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
  await datahubQueueRequest<
    NotifyUpdatePostTxFailedOrRetryStatusMutation,
    NotifyUpdatePostTxFailedOrRetryStatusMutationVariables
  >({
    document: NOTIFY_UPDATE_POST_TX_FAILED_OR_RETRY_STATUS_MUTATION,
    variables: {
      updatePostBlockchainSyncStatusInput: input,
    },
  })
}

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

export async function linkIdentity(input: CreateMutateLinkedIdentityInput) {
  // TODO: remove this when we have a better way to sign
  await backendSigWrapper(input)
  await datahubQueueRequest<
    LinkIdentityMutation,
    LinkIdentityMutationVariables
  >({
    document: LINK_IDENTITY_MUTATION,
    variables: {
      createLinkedIdentityInput: input,
    },
  })
}

// const UNLINK_IDENTITY_MUTATION = gql`
//   mutation UnlinkIdentity(
//     $createLinkedIdentityInput: CreateMutateLinkedIdentityInput!
//   ) {
//     deleteLinkedIdentity(
//       createLinkedIdentityInput: $createLinkedIdentityInput
//     ) {
//       processed
//       message
//     }
//   }
// `
// export async function unlinkIdentity(input: CreateMutateLinkedIdentityInput) {
//   // TODO: remove this when we have a better way to sign
//   await backendSigWrapper(input)
//   await datahubQueueRequest<
//     Mutation['deleteLinkedIdentity'],
//     MutationDeleteLinkedIdentityArgs
//   >({
//     document: UNLINK_IDENTITY_MUTATION,
//     variables: {
//       deleteLinkedIdentityInput: input,
//     },
//   })
// }
