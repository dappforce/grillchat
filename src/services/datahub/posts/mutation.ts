import { Signer } from '@/utils/account'
import { PostContent } from '@subsocial/api/types'
import {
  CreatePostCallParsedArgs,
  SynthCreatePostTxFailedCallParsedArgs,
  SynthCreatePostTxRetryCallParsedArgs,
  UpdatePostCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import { sortObj } from 'jsonabc'
import {
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  NotifyPostTxFailedMutation,
  NotifyPostTxFailedMutationVariables,
  SocialCallName,
  SocialEventDataType,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from '../generated-mutation'
import { PostKind } from '../generated-query'
import { datahubMutationRequest } from '../utils'

type DatahubParams<T> = T & {
  txSig: string
  address: string
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
export async function createPostData({
  address,
  contentCid,
  rootPostId,
  spaceId,
  content,
  txSig,
}: DatahubParams<{
  rootPostId?: string
  spaceId: string
  contentCid: string
  content: PostContent
}>) {
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    spaceId,
    ipfsSrc: contentCid,
  }

  await datahubMutationRequest<
    CreatePostOptimisticMutation,
    CreatePostOptimisticMutationVariables
  >({
    document: CREATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      createPostOptimisticInput: {
        dataType: SocialEventDataType.Optimistic,
        callData: {
          txSig,
          name: SocialCallName.CreatePost,
          signer: address || '',
          args: JSON.stringify(eventArgs),
        },
        content: JSON.stringify(content),
      },
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
export async function updatePostData({
  address,
  postId,
  content,
  txSig,
}: DatahubParams<{
  postId: string
  content: PostContent
}>) {
  const eventArgs: UpdatePostCallParsedArgs = {
    spaceId: null,
    hidden: null,
    postId,
  }

  await datahubMutationRequest<
    UpdatePostOptimisticMutation,
    UpdatePostOptimisticMutationVariables
  >({
    document: UPDATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      updatePostOptimisticInput: {
        dataType: SocialEventDataType.Optimistic,
        callData: {
          txSig,
          name: SocialCallName.UpdatePost,
          signer: address || '',
          args: JSON.stringify(eventArgs),
        },
        content: JSON.stringify(content),
      },
    },
  })
}

const NOTIFY_POST_TX_FAILED_MUTATION = gql`
  mutation NotifyPostTxFailed(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      message
    }
  }
`
export async function notifyCreatePostFailed({
  address,
  isRetrying,
  signer,
  ...args
}: Omit<
  DatahubParams<{
    signer: Signer
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
        name: SocialCallName.SynthUpdatePostTxRetry
        args: SynthCreatePostTxRetryCallParsedArgs
      } = {
    name: SocialCallName.SynthCreatePostTxFailed,
    args,
  }
  if (isRetrying) {
    event = {
      name: SocialCallName.SynthUpdatePostTxRetry,
      args: {
        ...args,
        success: isRetrying.success,
      },
    }
  }

  const txSig = Buffer.from(
    signer.sign(JSON.stringify(sortObj(event.args))).buffer
  ).toString('hex')
  console.log(txSig)

  await datahubMutationRequest<
    NotifyPostTxFailedMutation,
    NotifyPostTxFailedMutationVariables
  >({
    document: NOTIFY_POST_TX_FAILED_MUTATION,
    variables: {
      updatePostBlockchainSyncStatusInput: {
        dataType: SocialEventDataType.Optimistic,
        callData: {
          txSig,
          name: event.name,
          signer: address || '',
          args: JSON.stringify(event.args),
        },
      },
    },
  })
}
