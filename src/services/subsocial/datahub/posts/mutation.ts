import { Signer } from '@/utils/account'
import { u8aToHex } from '@polkadot/util'
import { PostContent } from '@subsocial/api/types'
import {
  CreatePostCallParsedArgs,
  SynthCreatePostTxFailedCallParsedArgs,
  SynthCreatePostTxRetryCallParsedArgs,
  SynthUpdatePostTxFailedCallParsedArgs,
  SynthUpdatePostTxRetryCallParsedArgs,
  UpdatePostCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import sortKeys from 'sort-keys-recursive'
import {
  CreatePostOptimisticInput,
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  NotifyCreatePostTxFailedOrRetryStatusMutation,
  NotifyCreatePostTxFailedOrRetryStatusMutationVariables,
  NotifyUpdatePostTxFailedOrRetryStatusMutation,
  NotifyUpdatePostTxFailedOrRetryStatusMutationVariables,
  SocialCallName,
  SocialEventDataType,
  UpdatePostBlockchainSyncStatusInput,
  UpdatePostOptimisticInput,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from '../generated-mutation'
import { PostKind } from '../generated-query'
import { datahubMutationRequest, datahubMutationWrapper } from '../utils'

type DatahubParams<T> = T & {
  address: string
  signer: Signer | null
}

function augmentInputSig(signer: Signer | null, payload: { sig: string }) {
  if (!signer) throw new Error('Signer is not defined')
  const sortedPayload = sortKeys(payload)
  const sig = signer.sign(JSON.stringify(sortedPayload))
  const hexSig = u8aToHex(sig)
  payload.sig = hexSig
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
async function createPostData({
  address,
  cid,
  rootPostId,
  spaceId,
  content,
  signer,
}: DatahubParams<{
  rootPostId?: string
  spaceId: string
  cid: string
  content: PostContent
}>) {
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    spaceId,
    ipfsSrc: cid,
  }

  const input: CreatePostOptimisticInput = {
    dataType: SocialEventDataType.Optimistic,
    callData: {
      name: SocialCallName.CreatePost,
      signer: address || '',
      args: JSON.stringify(eventArgs),
    },
    content: JSON.stringify(content),
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

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
async function updatePostData({
  address,
  postId,
  content,
  signer,
  cid,
}: DatahubParams<{
  postId: string
  content: PostContent
  cid: string
}>) {
  const eventArgs: UpdatePostCallParsedArgs = {
    spaceId: null,
    hidden: null,
    postId,
    ipfsSrc: cid,
  }

  const input: UpdatePostOptimisticInput = {
    dataType: SocialEventDataType.Optimistic,
    callData: {
      name: SocialCallName.UpdatePost,
      signer: address || '',
      args: JSON.stringify(eventArgs),
    },
    providerAddr: address,
    content: JSON.stringify(content),
    sig: '',
  }
  augmentInputSig(signer, input)

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
async function notifyCreatePostFailedOrRetryStatus({
  address,
  isRetrying,
  signer,
  ...args
}: Omit<
  DatahubParams<{
    isRetrying?: {
      success: boolean
    }
    reason?: string
    optimisticId: string
    timestamp: string
  }>,
  'txSig'
>) {
  let event:
    | {
        name: SocialCallName.SynthCreatePostTxFailed
        args: SynthCreatePostTxFailedCallParsedArgs
      }
    | {
        name: SocialCallName.SynthCreatePostTxRetry
        args: SynthCreatePostTxRetryCallParsedArgs
      } = {
    name: SocialCallName.SynthCreatePostTxFailed,
    args,
  }
  if (isRetrying) {
    event = {
      name: SocialCallName.SynthCreatePostTxRetry,
      args: {
        ...args,
        success: isRetrying.success,
      },
    }
  }

  const input: UpdatePostBlockchainSyncStatusInput = {
    dataType: SocialEventDataType.OffChain,
    callData: {
      name: event.name,
      signer: address || '',
      args: JSON.stringify(event.args),
    },
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

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
async function notifyUpdatePostFailedOrRetryStatus({
  postId,
  address,
  isRetrying,
  signer,
  ...args
}: Omit<
  DatahubParams<{
    postId: string
    isRetrying?: {
      success: boolean
    }
    reason?: string
    timestamp: string
  }>,
  'txSig'
>) {
  const eventArgs = {
    ...args,
    persistentId: postId,
  }
  let event:
    | {
        name: SocialCallName.SynthUpdatePostTxFailed
        args: SynthUpdatePostTxFailedCallParsedArgs
      }
    | {
        name: SocialCallName.SynthUpdatePostTxRetry
        args: SynthUpdatePostTxRetryCallParsedArgs
      } = {
    name: SocialCallName.SynthUpdatePostTxFailed,
    args: eventArgs,
  }
  if (isRetrying) {
    event = {
      name: SocialCallName.SynthUpdatePostTxRetry,
      args: {
        ...eventArgs,
        success: isRetrying.success,
      },
    }
  }

  const input: UpdatePostBlockchainSyncStatusInput = {
    dataType: SocialEventDataType.OffChain,
    callData: {
      name: event.name,
      signer: address || '',
      args: JSON.stringify(event.args),
    },
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

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

const datahubMutation = {
  createPostData: datahubMutationWrapper(createPostData),
  updatePostData: datahubMutationWrapper(updatePostData),
  notifyCreatePostFailedOrRetryStatus: datahubMutationWrapper(
    notifyCreatePostFailedOrRetryStatus
  ),
  notifyUpdatePostFailedOrRetryStatus: datahubMutationWrapper(
    notifyUpdatePostFailedOrRetryStatus
  ),
}
export default datahubMutation
