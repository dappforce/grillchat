import AboutChatRedirectPage from '@/modules/chat/AboutChatRedirectPage'
import { getPostsFromCache } from '@/pages/api/posts'
import { AppCommonProps } from '@/pages/_app'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({}),
  async (context) => {
    const slug = context.params?.slug as string
    const chatId = getIdFromSlug(slug)
    if (!chatId) return undefined

    let title = ''
    let description = ''

    try {
      const [chat] = await getPostsFromCache([chatId])
      title = chat.content?.title ?? ''
      description = chat.content?.body ?? ''
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

export default AboutChatRedirectPage
