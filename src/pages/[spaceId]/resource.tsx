import StubChatPage from '@/modules/chat/ChatPage/StubChatPage'
import { getCommonServerSideProps } from '@/utils/page'
import { getDiscussion } from '../api/discussion'

export const getServerSideProps = getCommonServerSideProps(
  {},
  async (context) => {
    const spaceId = context.params?.spaceId as string
    const resourceId = context.query.resourceId as string

    if (!spaceId || !resourceId) {
      return undefined
    }

    const linkedResource = await getDiscussion(resourceId)
    if (linkedResource) {
      return {
        props: {},
        redirect: {
          destination: `/${spaceId}/${linkedResource}`,
          permanent: false,
        },
      }
    }

    return {
      props: {},
    }
  }
)

export default StubChatPage
