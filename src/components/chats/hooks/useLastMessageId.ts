import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import { getDatahubConfig } from '@/utils/env/client'

export function useLastMessageId(chatId: string) {
  if (getDatahubConfig()) {
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

export function useLastMessageIds(chatIds: string[]) {
  if (getDatahubConfig()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLastMessageIdsFromDatahub(chatIds)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLastMessageIdsFromBlockchain(chatIds)
  }
}
function useLastMessageIdsFromDatahub(chatIds: string[]) {
  const postMetadatas = getPostMetadataQuery.useQueries(chatIds)
  return postMetadatas.map(({ data }) => data?.lastCommentId)
}
function useLastMessageIdsFromBlockchain(chatIds: string[]) {
  const commentIdsQueries = getCommentIdsByPostIdFromChainQuery.useQueries(
    chatIds,
    {
      subscribe: true,
    }
  )
  return commentIdsQueries.map(({ data }) => data?.[data?.length - 1])
}
