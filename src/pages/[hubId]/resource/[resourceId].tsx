import StubChatPage from '@/modules/chat/ChatPage/StubChatPage'
import { getDiscussion } from '@/pages/api/discussion'
import { getCommonServerSideProps } from '@/utils/page'

export const getServerSideProps = getCommonServerSideProps(
  {},
  async (context) => {
    context.res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate')
    const { hubId, resourceId } = context.params || {}

    if (!hubId || !resourceId) {
      return undefined
    }

    const linkedResource = await getDiscussion(resourceId as string)
    if (!linkedResource) {
      return {
        props: {},
      }
    }

    return {
      redirect: {
        destination: `/${hubId}/${linkedResource}?${
          context.req.url?.split('?')[1]
        })}`,
        permanent: false,
      },
    }
  }
)

export default StubChatPage
