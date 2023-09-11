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
} from '../generated'
import { datahubRequest } from '../utils'

const CREATE_POST_OPTIMISTIC_MUTATION = gql`
  mutation CreatePostOptimistic(
    $createPostOptimisticInput: CreatePostOptimisticInput!
  ) {
    createPostOptimistic(
      createPostOptimisticInput: $createPostOptimisticInput
    ) {
      id
    }
  }
`

export async function createPostData({
  address,
  contentCid,
  rootPostId,
  spaceId,
  content,
}: {
  address: string
  rootPostId: string
  spaceId: string
  contentCid: string
  content: PostContent
}) {
  const dataHubData: SocialEventData = {
    dataType: SocialEventDataType.optimistic,
    callData: {
      name: 'create_post',
      signer: address || '',
      args: {
        forced: false,
        postKind: PostKind.Comment,
        rootPostId,
        spaceId,
        ipfsSrc: contentCid,
      },
    },
    content,
  }

  const dataHubDataApiInput = {
    dataType: dataHubData.dataType,
    callData: {
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
