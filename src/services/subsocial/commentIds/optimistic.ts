import { getPostQuery } from '@/services/api/query'
import { getDatahubConfig } from '@/utils/env/client'
import { PostContent, PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import {
  getCommentIdsByPostIdFromDatahubQuery,
  getPostMetadataQuery,
} from '../datahub/posts/query'
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
}
export function addOptimisticData({
  client,
  params,
  ipfsContent,
  address,
}: OptimisticGeneratorParams) {
  if (!ipfsContent.optimisticId) return

  const tempId = commentIdsOptimisticEncoder.encode(ipfsContent.optimisticId)
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
    getCommentIdsByPostIdFromDatahubQuery.setQueryFirstPageData(
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
  optimisticId,
}: {
  client: QueryClient
  chatId: string
  optimisticId: string
}) {
  const tempId = commentIdsOptimisticEncoder.encode(optimisticId)
  // getCommentIdsByPostIdQuery.setQueryData(client, chatId, (ids) => {
  //   return ids?.filter((id) => id !== tempId)
  // })
  getPostMetadataQuery.invalidate(client, chatId)
}
