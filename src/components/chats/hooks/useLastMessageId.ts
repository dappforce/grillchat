import { getPostMetadataQuery } from '@/services/datahub/posts/query'

export function useLastMessageId(chatId: string) {
  const { data } = getPostMetadataQuery.useQuery(chatId)
  const lastIdFromDatahub = data?.lastCommentId
  return lastIdFromDatahub
}

type LastMessage = { createdAtTime: number; rootPostId: string }
export function useLastMessages(chatIds: string[]): LastMessage[] {
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
