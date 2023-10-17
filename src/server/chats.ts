import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import { getPostsServer } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsByPostIdQuery } from '@/services/subsocial/commentIds'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getDatahubConfig } from '@/utils/env/client'
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
      JSON.parse(JSON.stringify(post)) as PostData
    )
  })
}

export async function getChatPreviewsData(
  queryClient: QueryClient,
  chatIds: string[]
) {
  const lastMessageGetter = !!getDatahubConfig()
    ? getLastMessagesFromDatahub
    : getLastMessages
  const [lastMessages, chats] = await Promise.all([
    lastMessageGetter(queryClient, chatIds),
    getPostsServer(chatIds),
  ] as const)

  return { chats, lastMessages }
}
async function getLastMessagesFromDatahub(
  queryClient: QueryClient,
  chatIds: string[]
) {
  const postMetadatas = await Promise.all(
    chatIds
      .map((chatId) => {
        return getPostMetadataQuery.fetchQuery(queryClient, chatId)
      })
      .filter(Boolean)
  )
  const lastMessageIds = postMetadatas
    .map((metadata) => metadata?.lastCommentId)
    .filter(Boolean) as string[]
  let lastMessages: PostData[] = []
  if (lastMessageIds.length > 0) {
    lastMessages = await getPostsServer(lastMessageIds)
  }
  return lastMessages
}

async function getLastMessages(queryClient: QueryClient, chatIds: string[]) {
  const messageIdsByChatIds = await Promise.all(
    chatIds.map((chatId) => {
      return getCommentIdsByPostIdQuery.fetchQuery(queryClient, chatId)
    })
  )
  const lastMessageIds = messageIdsByChatIds
    .map((ids) => ids[ids.length - 1])
    .filter((id) => !!id)

  let lastMessages: PostData[] = []
  if (lastMessageIds.length > 0) {
    lastMessages = await getPostsServer(lastMessageIds)
  }
  return lastMessages
}
