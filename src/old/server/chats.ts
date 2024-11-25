import { constantsConfig } from '@/constants/config'
import { getPostMetadataQuery } from '@/old/services/datahub/posts/query'
import { isDatahubAvailable } from '@/old/services/datahub/utils'
import { getCommentIdsByPostIdFromChainQuery } from '@/old/services/subsocial/commentIds'
import { getPostsServer } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { removeUndefinedValues } from '@/utils/general'
import { PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import { getPostIdsBySpaceIdQuery } from '../services/subsocial/posts'
import { prefetchBlockedEntities } from './moderation/prefetch'

async function prefetchChatsMetadata(queryClient: QueryClient, hubId: string) {
  const res = await getPostIdsBySpaceIdQuery.fetchQuery(queryClient, hubId)
  const allChatIds = [
    ...(res?.postIds ?? []),
    ...(constantsConfig.linkedChatsForHubId[hubId] ?? []),
  ]

  const { lastMessages, chats } = await getChatPreviewsData(
    queryClient,
    allChatIds
  )

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
  const lastMessageGetter = isDatahubAvailable
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

async function getLastMessages(queryClient: QueryClient, chatIds: string[]) {
  const messageIdsByChatIds = await Promise.all(
    chatIds.map((chatId) => {
      return getCommentIdsByPostIdFromChainQuery.fetchQuery(queryClient, chatId)
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
