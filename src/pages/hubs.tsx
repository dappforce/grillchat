import { getSpaceIdFromAlias } from '@/constants/chat-room'
import { HUBS } from '@/constants/hubs'
import HubsPage from '@/modules/chat/HubsPage'
import { HubsPageProps } from '@/modules/chat/HubsPage/HubsPage'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getCommonStaticProps } from '@/utils/page'

export const getStaticProps = getCommonStaticProps<HubsPageProps>(
  () => ({}),
  async (context) => {
    const hubsChatCount: HubsPageProps['hubsChatCount'] = {}

    try {
      const subsocialApi = await getSubsocialApi()
      await Promise.all(
        HUBS.map(async (hub) => {
          const spaceId = getSpaceIdFromAlias(hub.path) ?? hub.path
          const chatIds = await subsocialApi.blockchain.postIdsBySpaceId(
            spaceId
          )
          hubsChatCount[hub.path] = chatIds.length
        })
      )
    } catch (err) {
      console.error('Error fetching for hubs page: ', err)
    }

    return {
      props: {
        hubsChatCount,
        isIntegrateChatButtonOnTop: Math.random() > 0.5,
      },
    }
  }
)
export default HubsPage
