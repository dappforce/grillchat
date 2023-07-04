import { getPostQuery } from '@/services/api/query'
import { ReplyWrapper } from '@/utils/ipfs'
import { PostContent, PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import { getCommentIdsQueryKey } from './query'
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
      rootPostId: params.chatId,
    },
    content: getOptimisticContent({
      body: params.message ?? '',
      inReplyTo: ReplyWrapper(params.replyTo),
      extensions: params.extensions,
    }),
  } as PostData)
  client.setQueryData<string[]>(getCommentIdsQueryKey(params.chatId), (ids) => {
    return [...(ids ?? []), tempId]
  })
}
export function deleteOptimisticData({
  client,
  params,
  tempId,
}: OptimisticGeneratorParams) {
  client.removeQueries(getPostQuery.getQueryKey(tempId))
  client.setQueryData<string[]>(getCommentIdsQueryKey(params.chatId), (ids) => {
    return ids?.filter((id) => id !== tempId)
  })
}
