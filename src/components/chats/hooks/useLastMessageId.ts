import { getPostQuery } from '@/old/services/api/query'
import { getPostMetadataQuery } from '@/old/services/datahub/posts/query'
import { isDatahubAvailable } from '@/old/services/datahub/utils'
import { getCommentIdsByPostIdFromChainQuery } from '@/old/services/subsocial/commentIds'

export function useLastMessageId(chatId: string) {
  if (isDatahubAvailable) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLastMessageIdFromDatahub(chatId)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLastMessageIdFromBlockchain(chatId)
  }
}
function useLastMessageIdFromDatahub(chatId: string) {
  const { data } = getPostMetadataQuery.useQuery(chatId)
  const lastIdFromDatahub = data?.lastCommentId
  return lastIdFromDatahub
}
function useLastMessageIdFromBlockchain(chatId: string) {
  const { data: messageIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      subscribe: true,
    }
  )
  const lastMessageId = messageIds?.[messageIds?.length - 1]
  return lastMessageId
}

type LastMessage = { createdAtTime: number; rootPostId: string }
export function useLastMessages(chatIds: string[]): LastMessage[] {
  if (isDatahubAvailable) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLastMessagesFromDatahub(chatIds)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLastMessageIdsFromBlockchain(chatIds)
  }
}
function useLastMessagesFromDatahub(chatIds: string[]): LastMessage[] {
  const postMetadatas = getPostMetadataQuery.useQueries(chatIds)

  return postMetadatas
    .map(({ data }) =>
      data
        ? {
            createdAtTime: new Date(data.createdAtTime).getTime(),
            rootPostId: data?.postId,
          }
        : undefined
    )
    .filter(Boolean)
}
function useLastMessageIdsFromBlockchain(chatIds: string[]): LastMessage[] {
  const commentIdsQueries = getCommentIdsByPostIdFromChainQuery.useQueries(
    chatIds,
    {
      subscribe: true,
    }
  )
  const latestMessageIds = commentIdsQueries.map(
    ({ data }) => data?.[data?.length - 1]
  )

  const filteredLatestMessageIds = latestMessageIds?.filter(Boolean) as string[]

  const lastMessageQueries = getPostQuery.useQueries(
    filteredLatestMessageIds ?? []
  )
  return lastMessageQueries
    .map(({ data }) => data)
    ?.filter(Boolean)
    .map(({ struct, content }) => ({
      body: content?.body ?? '',
      createdAtTime: struct.createdAtTime,
      rootPostId: struct.rootPostId,
    }))
}
