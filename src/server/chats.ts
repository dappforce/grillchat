import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import { getPostsServer } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import { prefetchBlockedEntities } from './moderation/prefetch'

export async function prefetchChatPreviewsData(
  queryClient: QueryClient,
  hubId: string
) {
  const res = await getPostIdsBySpaceIdQuery.fetchQuery(queryClient, hubId)
  const allChatIds = [
    ...(res?.postIds ?? []),
    ...getLinkedChatIdsForHubId(hubId),
  ]

  const [{ lastMessages, chats }] = await Promise.all([
    getChatPreviewsData(queryClient, allChatIds),
    getSpaceQuery.fetchQuery(queryClient, hubId),
  ] as const)

  const additionalHubIds: Set<string> = new Set()
  chats.forEach((chat) => {
    const originalHubId = chat.struct.spaceId
    if (!originalHubId || originalHubId === hubId) return

    additionalHubIds.add(originalHubId)
  })
  await prefetchBlockedEntities(
    queryClient,
    [hubId, ...Array.from(additionalHubIds)],
    allChatIds
  )
  ;[...lastMessages, ...chats].forEach((post) => {
    getPostQuery.setQueryData(
      queryClient,
      post.id,
      JSON.parse(JSON.stringify(post))
    )
  })
}

export async function getChatPreviewsData(
  queryClient: QueryClient,
  chatIds: string[]
) {
  const [postMetadatas, chats] = await Promise.all([
    Promise.all(
      chatIds
        .map((chatId) => {
          return getPostMetadataQuery.fetchQuery(queryClient, chatId)
        })
        .filter(Boolean)
    ),
    getPostsServer(chatIds),
  ] as const)

  const lastCommentIds = postMetadatas.map(
    (metadata) => metadata?.lastCommentId
  )
  const lastMessages = await getLastMessages(lastCommentIds as string[])

  return { chats, lastMessages }
}
async function getLastMessages(lastMessageIds: string[]) {
  let lastMessages: PostData[] = []
  if (lastMessageIds.length > 0) {
    lastMessages = await getPostsServer(lastMessageIds)
  }
  return lastMessages
}
