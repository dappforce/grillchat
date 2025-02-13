import { env } from '@/env.mjs'
import StubChatPage from '@/modules/chat/ChatPage/StubChatPage'
import { getCommonServerSideProps } from '@/utils/page'

export const getServerSideProps = getCommonServerSideProps(
  {},
  async (context) => {
    context.res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate')
    const { resourceURL } = context.params || {}

    const hubId = env.NEXT_PUBLIC_RESOURCES_ID

    if (!hubId || !resourceURL) {
      return undefined
    }

    // TODO: get linked resource from resourceId
    const linkedResource = undefined
    if (!linkedResource) {
      return {
        props: {},
      }
    }

    const queryParams = context.req.url?.split('?')?.[1] ?? ''
    return {
      redirect: {
        destination: `/${hubId}/${linkedResource}?${queryParams})}`,
        permanent: false,
      },
    }
  }
)

export default StubChatPage
