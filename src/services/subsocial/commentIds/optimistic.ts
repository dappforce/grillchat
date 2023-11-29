import { getPostQuery } from '@/services/api/query'
import { getDatahubConfig } from '@/utils/env/client'
import { PostContent, PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import {
  getPaginatedPostsByPostIdFromDatahubQuery,
  getPostMetadataQuery,
} from '../../datahub/posts/query'
import { getCommentIdsByPostIdFromChainQuery } from './query'
import { SendMessageParams } from './types'

export function getOptimisticContent(
  postContent: Pick<PostContent, 'body' | 'inReplyTo' | 'extensions'>
) {
  return {
    body: postContent.body,
    inReplyTo: postContent.inReplyTo,
    extensions: postContent.extensions,
  }
}

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
  customId?: string
}
export function addOptimisticData({
  client,
  params,
  ipfsContent,
  customId,
  address,
}: OptimisticGeneratorParams) {
  const id = customId || ipfsContent.optimisticId
  if (!id) return

  const tempId = commentIdsOptimisticEncoder.encode(id)
  getPostQuery.setQueryData(client, tempId, {
    id: tempId,
    struct: {
      createdAtTime: Date.now(),
      ownerId: address,
      rootPostId: params.chatId,
    },
    content: ipfsContent,
  } as unknown as PostData)
  if (getDatahubConfig()) {
    getPaginatedPostsByPostIdFromDatahubQuery.setQueryFirstPageData(
      client,
      params.chatId,
      (oldData) => {
        return [tempId, ...(oldData ?? [])]
      }
    )
    getPostMetadataQuery.setQueryData(client, params.chatId, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        totalCommentsCount: oldData.totalCommentsCount + 1,
        lastCommentId: tempId,
      }
    })
  } else {
    getCommentIdsByPostIdFromChainQuery.setQueryData(
      client,
      params.chatId,
      (ids) => {
        return [...(ids ?? []), tempId]
      }
    )
  }
}
export function deleteOptimisticData({
  client,
  chatId,
  idToDelete,
}: {
  client: QueryClient
  chatId: string
  idToDelete: string
}) {
  const tempId = commentIdsOptimisticEncoder.encode(idToDelete)

  if (getDatahubConfig()) {
    getPaginatedPostsByPostIdFromDatahubQuery.setQueryFirstPageData(
      client,
      chatId,
      (oldData) => {
        return oldData?.filter((id) => id !== tempId)
      }
    )
  } else {
    getCommentIdsByPostIdFromChainQuery.setQueryData(client, chatId, (ids) => {
      return ids?.filter((id) => id !== tempId)
    })
  }

  getPostMetadataQuery.invalidate(client, chatId)
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
