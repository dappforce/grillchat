import { PostContent } from '@subsocial/api/types'
import { SocialEventData } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  SocialCallName,
  SocialEventDataType,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from '../generated-mutation'
import { PostKind } from '../generated-query'
import { datahubMutationRequest } from '../utils'

type DatahubParams<T> = T & {
  txSig: string
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
  address: string
  rootPostId?: string
  spaceId: string
  contentCid: string
  content: PostContent
}>) {
  const eventArgs: SocialEventData['callData']['args'] = {
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
  contentCid,
  rootPostId,
  content,
  txSig,
}: DatahubParams<{
  address: string
  postId: string
  rootPostId?: string
  contentCid: string
  content: PostContent
}>) {
  const eventArgs: SocialEventData['callData']['args'] = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    postId,
    ipfsSrc: contentCid,
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
