import { PostContent } from '@subsocial/api/types'
import {
  PostKind,
  SocialEventData,
  SocialEventDataApiInput,
  SocialEventDataType,
} from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  CreatePostOptimisticMutation,
  CreatePostOptimisticMutationVariables,
  UpdatePostOptimisticMutation,
  UpdatePostOptimisticMutationVariables,
} from '../generated-mutation'
import { datahubRequest } from '../utils'

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
  const dataHubData: SocialEventData = {
    dataType: SocialEventDataType.optimistic,
    callData: {
      name: 'create_post',
      signer: address || '',
      args: {
        forced: false,
        postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
        rootPostId,
        spaceId,
        ipfsSrc: contentCid,
      },
      txSig,
    },
    content,
  }

  const dataHubDataApiInput = {
    dataType: dataHubData.dataType,
    callData: {
      txSig,
      name: dataHubData.callData.name,
      signer: dataHubData.callData.signer,
      args: JSON.stringify(dataHubData.callData.args),
    },
    content: JSON.stringify(dataHubData.content),
  } satisfies SocialEventDataApiInput

  await datahubRequest<
    CreatePostOptimisticMutation,
    CreatePostOptimisticMutationVariables
  >({
    document: CREATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      // @ts-ignore
      createPostOptimisticInput: dataHubDataApiInput,
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
  const dataHubData: SocialEventData = {
    dataType: SocialEventDataType.optimistic,
    callData: {
      txSig,
      name: 'update_post',
      signer: address || '',
      args: {
        postId,
        forced: false,
        postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
        ipfsSrc: contentCid,
      },
    },
    content,
  }

  const dataHubDataApiInput = {
    dataType: dataHubData.dataType,
    callData: {
      txSig,
      name: dataHubData.callData.name,
      signer: dataHubData.callData.signer,
      args: JSON.stringify(dataHubData.callData.args),
    },
    content: JSON.stringify(dataHubData.content),
  } satisfies SocialEventDataApiInput

  await datahubRequest<
    UpdatePostOptimisticMutation,
    UpdatePostOptimisticMutationVariables
  >({
    document: UPDATE_POST_OPTIMISTIC_MUTATION,
    variables: {
      // @ts-ignore
      updatePostOptimisticInput: dataHubDataApiInput,
    },
  })
}
