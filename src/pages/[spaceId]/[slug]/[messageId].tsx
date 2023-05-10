import MessageRedirectPage from '@/modules/chat/MessageRedirectPage'
import { getPostsFromCache } from '@/pages/api/posts'
import { AppCommonProps } from '@/pages/_app'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({}),
  async (context) => {
    const messageId = context.params?.messageId as string | undefined
    const slug = context.params?.slug as string
    const chatId = getIdFromSlug(slug)
    if (!messageId || !chatId) return undefined

    let title = ''
    let description = ''

    try {
      const [chat, message] = await getPostsFromCache([chatId, messageId])
      title = `Message from ${chat.content?.title}`
      description = message.content?.body ?? ''
    } catch (err) {
      console.error('Error fetching for chat about page: ', err)
    }

    return {
      props: {
        head: {
          title,
          description,
        },
      },
      revalidate: 2,
    }
  }
)

export default MessageRedirectPage
