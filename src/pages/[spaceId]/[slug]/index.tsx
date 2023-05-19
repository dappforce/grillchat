import { CHAT_PER_PAGE } from '@/constants/chat'
import ChatPage, { ChatPageProps } from '@/modules/chat/ChatPage'
import { getPostsFromCache } from '@/pages/api/posts'
import { AppCommonProps } from '@/pages/_app'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getCommonStaticProps } from '@/utils/page'
import { prefetchBlockedEntities } from '@/utils/server'
import { getIdFromSlug } from '@/utils/slug'
import { isValidNumber } from '@/utils/strings'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  // For chats page, skip pre-rendering, because it will cause super slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

function getValidatedChatId(slugParam: string) {
  const chatId = getIdFromSlug(slugParam)
  if (!chatId || !isValidNumber(chatId)) return undefined

  return chatId
}

async function getChatsData(chatId: string) {
  const [chatData] = await getPostsFromCache([chatId])

  const subsocialApi = await getSubsocialApi()
  const messageIds = await subsocialApi.blockchain.getReplyIdsByPostId(chatId)

  const preloadedPostCount = CHAT_PER_PAGE * 2
  const startSlice = Math.max(0, messageIds.length - preloadedPostCount)
  const endSlice = messageIds.length
  const prefetchedMessageIds = messageIds.slice(startSlice, endSlice)
  const messages = await getPostsFromCache(prefetchedMessageIds)

  return { messages, chatData, messageIds }
}

export const getStaticProps = getCommonStaticProps<
  ChatPageProps & AppCommonProps
>(
  () => ({
    head: { disableZoom: true },
  }),
  async (context) => {
    const slugParam = context.params?.slug as string
    const chatId = getValidatedChatId(slugParam)
    if (!chatId) return undefined

    const queryClient = new QueryClient()

    let title: string | null = null
    let desc: string | null = null
    try {
      const [{ messageIds, messages, chatData }] = await Promise.all([
        getChatsData(chatId),
        prefetchBlockedEntities(queryClient, [chatId]),
      ] as const)

      title = chatData?.content?.title || null
      desc = chatData?.content?.body || null

      getPostQuery.setQueryData(queryClient, chatId, chatData)
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
        head: {
          title,
          description: desc,
        },
      },
      revalidate: 2,
    }
  }
)

export default ChatPage
