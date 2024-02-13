import AboutChatRedirectPage from '@/modules/chat/AboutChatRedirectPage'
import { getPostsServer } from '@/pages/api/posts'
import { AppCommonProps } from '@/pages/_app'
import { getIpfsContentUrl } from '@/utils/ipfs'
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
    let image = ''

    try {
      const [chat] = await getPostsServer([chatId])
      const content = chat.content
      if (!chat.struct.hidden) {
        title = content?.title ?? ''
        description = content?.body ?? ''
        image = content?.image ? getIpfsContentUrl(content?.image) : ''
      }
    } catch (err) {
      console.error('Error fetching for chat about page: ', err)
    }

    return {
      props: {
        head: {
          title,
          description,
          image,
        },
      },
      revalidate: 2,
    }
  }
)

export default AboutChatRedirectPage
