import StubChatPage from '@/modules/chat/ChatPage/StubChatPage'
import { getDiscussion } from '@/pages/api/discussion'
import { getCommonStaticProps } from '@/utils/page'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps = getCommonStaticProps(
  () => ({}),
  async (context) => {
    const { spaceId, resourceId } = context.params || {}

    if (!spaceId || !resourceId) {
      return undefined
    }

    const linkedResource = await getDiscussion(resourceId as string)
    if (!linkedResource) {
      return {
        props: {},
        revalidate: 2,
      }
    }

    return {
      redirect: {
        destination: `/${spaceId}/${linkedResource}`,
        permanent: false,
      },
      revalidate: 2,
    }
  }
)

export default StubChatPage
