import { getPostQuery } from '@/services/api/query'
import { ReplyWrapper } from '@/utils/ipfs'
import { PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import { getCommentIdsQueryKey } from './query'
import { SendMessageParams } from './types'

type OptimisticGeneratorParams = {
  client: QueryClient
  params: SendMessageParams
  tempId: string
  address: string
}
export function addOptimisticData({
  client,
  params,
  tempId,
  address,
}: OptimisticGeneratorParams) {
  getPostQuery.setQueryData(client, tempId, {
    id: tempId,
    struct: {
      createdAtTime: Date.now(),
      ownerId: address,
    },
    content: {
      body: params.message,
      inReplyTo: ReplyWrapper(params.replyTo),
    },
  } as PostData)
  client.setQueryData<string[]>(
    getCommentIdsQueryKey(params.rootPostId),
    (ids) => {
      return [...(ids ?? []), tempId]
    }
  )
}
export function deleteOptimisticData({
  client,
  params,
  tempId,
}: OptimisticGeneratorParams) {
  client.removeQueries(getPostQuery.getQueryKey(tempId))
  client.setQueryData<string[]>(
    getCommentIdsQueryKey(params.rootPostId),
    (ids) => {
      return ids?.filter((id) => id !== tempId)
    }
  )
}
