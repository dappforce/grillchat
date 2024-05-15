// import { getPostQuery } from '@/services/api/query'
import type { PostContent, PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
// import {
//   getPaginatedPostIdsByPostId,
//   getPostMetadataQuery,
// } from '../../datahub/posts/query'
import { getPostQuery } from '@/services/api/query'
import {
  getPaginatedPostIdsByPostId,
  getPostMetadataQuery,
} from '@/services/datahub/posts/query'
import type { SendMessageParams } from './types'

export const commentIdsOptimisticEncoder = {
  encode: (id: string) => `optimistic-${id}`,
  decode: (id: string) => id.replace('optimistic-', ''),
  checker: (id: string) => id.startsWith('optimistic-'),
}

type OptimisticGeneratorParams = {
  client: QueryClient
  params: SendMessageParams
  ipfsContent: PostContent
  address: string
  newId: string
}
export function addOptimisticData({
  client,
  params,
  ipfsContent,
  newId,
  address,
}: OptimisticGeneratorParams) {
  if (!newId) return

  getPostQuery.setQueryData(client, newId, {
    id: newId,
    struct: {
      createdAtTime: Date.now(),
      ownerId: address,
      rootPostId: params.chatId,
      parentPostId: params.replyTo,
    },
    content: ipfsContent,
  } as unknown as PostData)
  getPaginatedPostIdsByPostId.setQueryFirstPageData(
    client,
    params.chatId,
    (oldData) => {
      return [newId, ...(oldData ?? [])]
    }
  )
  getPostMetadataQuery.setQueryData(client, params.chatId, (oldData) => {
    if (!oldData) return oldData
    return {
      ...oldData,
      totalCommentsCount: oldData.totalCommentsCount + 1,
      lastCommentId: newId,
    }
  })
}
export function deleteOptimisticData({
  client,
  idToDelete,
}: {
  client: QueryClient
  idToDelete: string
}) {
  getPostQuery.invalidate(client, idToDelete)

  // getPaginatedPostIdsByPostId.setQueryFirstPageData(
  //   client,
  //   chatId,
  //   (oldData) => {
  //     return oldData?.filter((id) => id !== tempId)
  //   }
  // )

  // getPostMetadataQuery.invalidate(client, chatId)
}

export function isClientGeneratedOptimisticId(id?: string) {
  return id && commentIdsOptimisticEncoder.checker(id)
}

export function isMessageSent(
  id: string,
  messageDataType: PostData['struct']['dataType']
) {
  if (isClientGeneratedOptimisticId(id)) return false
  if (!messageDataType) return true
  if (messageDataType === 'offChain' || messageDataType === 'persistent')
    return true

  return false
}
