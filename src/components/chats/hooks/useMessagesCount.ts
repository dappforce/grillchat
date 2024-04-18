import { getPostMetadataQuery } from '@/services/datahub/posts/query'

export function useMessagesCount(chatId: string) {
  const { data } = getPostMetadataQuery.useQuery(chatId)
  const messagesCount = data?.totalCommentsCount ?? 0
  return messagesCount
}

export function useMessagesCounts(chatIds: string[]) {
  const postMetadataQueries = getPostMetadataQuery.useQueries(chatIds)
  return postMetadataQueries.map(({ data }) => data?.totalCommentsCount ?? 0)
}
