import { CHAT_PER_PAGE } from '@/constants/chat'
import ChatPage from '@/modules/_[spaceId]/ChatPage'
import { ChatPageProps } from '@/modules/_[spaceId]/ChatPage/ChatPage'
import { getPostsFromCache } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getSpaceIds } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { prefetchBlockedEntities } from '@/utils/server'
import { createSlug, getIdFromSlug } from '@/utils/slug'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const spaceIds = getSpaceIds()
  const paths: Awaited<ReturnType<GetStaticPaths>>['paths'] = []

  spaceIds.forEach(async (spaceId) => {
    const subsocialApi = await getSubsocialApi()
    const chatIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)
    const chats = await getPostsFromCache(chatIds)

    chats.forEach((chat) =>
      paths.push({
        params: { slug: [createSlug(chat.id, chat.content)] },
      })
    )
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

function getChatIdAndMessageId(slugParams: string[]) {
  if (slugParams.length <= 0 || slugParams.length > 2) {
    return undefined
  }

  const [slug, messageId] = slugParams as [string, string | undefined]
  const chatId = getIdFromSlug(slug)
  if (!chatId) return undefined

  const isInvalidChatId = messageId && isNaN(parseInt(messageId))
  if (isInvalidChatId) return undefined

  return [chatId, messageId] as const
}

async function getChatsData(chatId: string, messageId: string | undefined) {
  let chatIdAndMessageId = [chatId]
  if (messageId) chatIdAndMessageId.push(messageId)

  const [chatData, messageData] = await getPostsFromCache(chatIdAndMessageId)

  const subsocialApi = await getSubsocialApi()
  const messageIds = await subsocialApi.blockchain.getReplyIdsByPostId(chatId)

  const preloadedPostCount = CHAT_PER_PAGE * 2
  const startSlice = Math.max(0, messageIds.length - preloadedPostCount)
  const endSlice = messageIds.length
  const prefetchedMessageIds = messageIds.slice(startSlice, endSlice)
  const messages = await getPostsFromCache(prefetchedMessageIds)

  return { messages, chatData, messageData, messageIds }
}

export const getStaticProps = getCommonStaticProps<
  {
    dehydratedState: any
    title: string | null
    desc: string | null
  } & ChatPageProps
>(
  (data) => ({
    head: { disableZoom: true, title: data.title, description: data.desc },
  }),
  async (context) => {
    const slugParams = context.params?.slug as string[]
    const chatIdAndMessageId = getChatIdAndMessageId(slugParams)
    if (!chatIdAndMessageId) return undefined

    const [chatId, messageId] = chatIdAndMessageId

    const queryClient = new QueryClient()

    let title: string | null = null
    let desc: string | null = null
    try {
      const [{ messageData, messageIds, messages, chatData }] =
        await Promise.all([
          getChatsData(chatId, messageId),
          prefetchBlockedEntities(queryClient, [chatId]),
        ] as const)

      title = chatData?.content?.title || null
      if (messageData) {
        title = `Message from ${title}`
        desc = messageData?.content?.body || null
      }

      getPostQuery.setQueryData(queryClient, chatId, chatData)
      if (messageId && messageData)
        getPostQuery.setQueryData(queryClient, messageId, messageData)

      queryClient.setQueryData(
        getCommentIdsQueryKey(chatId),
        messageIds ?? null
      )
      messages.forEach((post) => {
        getPostQuery.setQueryData(queryClient, post.id, post)
      })
    } catch (err) {
      console.error('Error fetching for chat page: ', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        chatId,
        title,
        desc,
      },
      revalidate: 2,
    }
  }
)

export default ChatPage
