import { constantsConfig } from '@/constants/config'
import { getPostsServer } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import {
  getPostMetadataQuery,
  getPostsBySpaceIdQuery,
} from '@/services/datahub/posts/query'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { removeUndefinedValues } from '@/utils/general'
import { PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import { prefetchBlockedEntities } from './moderation/prefetch'

async function prefetchChatsMetadata(queryClient: QueryClient, hubId: string) {
  const chats = await getPostsBySpaceIdQuery.fetchQuery(queryClient, hubId)
  const allChatIds = [
    ...(chats?.map((p) => p.id) ?? []),
    ...(constantsConfig.linkedChatsForHubId[hubId] ?? []),
  ]
  const lastMessages = await getLastMessages(queryClient, allChatIds)

  const chatEntityIds = chats.map((chat) => chat.entityId ?? '')

  const additionalHubIds: Set<string> = new Set()
  chats.forEach((chat) => {
    const originalHubId = chat.struct.spaceId
    if (!originalHubId || originalHubId === hubId) return

    additionalHubIds.add(originalHubId)
  })

  await prefetchBlockedEntities(
    queryClient,
    [hubId, ...Array.from(additionalHubIds)],
    chatEntityIds
  )
  ;[...lastMessages, ...chats].forEach((post) => {
    getPostQuery.setQueryData(queryClient, post.id, removeUndefinedValues(post))
  })
}
export async function prefetchChatPreviewsData(
  queryClient: QueryClient,
  hubId: string
) {
  await Promise.all([
    prefetchChatsMetadata(queryClient, hubId),
    getSpaceQuery.fetchQuery(queryClient, hubId),
  ])
}

export async function getChatPreviewsData(
  queryClient: QueryClient,
  chatIds: string[]
) {
  const [lastMessages, chats] = await Promise.all([
    getLastMessages(queryClient, chatIds),
    getPostsServer(chatIds),
  ] as const)

  return { chats, lastMessages }
}
async function getLastMessages(queryClient: QueryClient, chatIds: string[]) {
  const postMetadatas = (
    await getPostMetadataQuery.fetchQueries(queryClient, chatIds)
  ).filter(Boolean)
  const lastMessageIds = postMetadatas
    .map((metadata) => metadata?.lastCommentId)
    .filter(Boolean) as string[]
  let lastMessages: PostData[] = []
  if (lastMessageIds.length > 0) {
    lastMessages = await getPostsServer(lastMessageIds)
  }
  return lastMessages
}
