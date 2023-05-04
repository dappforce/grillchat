import AboutChatPage, { AboutChatPageProps } from '@/modules/chat/AboutChatPage'
import { getPostsFromCache } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { QueryClient } from '@tanstack/react-query'

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps = getCommonStaticProps<AboutChatPageProps>(
  () => ({}),
  async (context) => {
    const slug = context.params?.slug as string
    const chatId = getIdFromSlug(slug)
    if (!chatId) return undefined

    const queryClient = new QueryClient()
    let messageCount = 0

    try {
      const subsocialApi = await getSubsocialApi()

      const [messageIds, chatResponse] = await Promise.all([
        subsocialApi.blockchain.getReplyIdsByPostId(chatId),
        getPostsFromCache([chatId]),
      ] as const)
      const chat = chatResponse[0]

      messageCount = messageIds.length
      getPostQuery.setQueryData(queryClient, chatId, chat)
    } catch (err) {
      console.error('Error fetching for chat about page: ', err)
    }

    return {
      props: {
        chatId,
        messageCount,
      },
      revalidate: 2,
    }
  }
)

export default AboutChatPage
