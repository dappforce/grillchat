import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import HomePage, { HubsPageProps } from '@/modules/chat/HomePage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getHubIds, getMainHubId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getStaticProps = getCommonStaticProps<
  HubsPageProps & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async () => {
    const hubsChatCount: HubsPageProps['hubsChatCount'] = {}
    const hubIds = getHubIds()

    const queryClient = new QueryClient()

    try {
      const subsocialApi = await getSubsocialApi()
      const hubsData = await subsocialApi.findSpaces({
        ids: hubIds,
        visibility: 'onlyVisible',
      })

      await Promise.all([
        prefetchChatPreviewsData(queryClient, getMainHubId()),
        ...hubsData.map(async (hub) => {
          const chatIds = await subsocialApi.blockchain.postIdsBySpaceId(hub.id)
          const linkedChats = getLinkedChatIdsForHubId(hub.id)
          hubsChatCount[hub.id] = chatIds.length + linkedChats.length
        }),
      ])

      hubsData.forEach((hub) => {
        getSpaceBySpaceIdQuery.setQueryData(queryClient, hub.id, hub)
      })
    } catch (err) {
      console.error('Error fetching for hubs page: ', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        hubsChatCount,
        isIntegrateChatButtonOnTop: Math.random() > 0.5,
      },
      revalidate: 2,
    }
  }
)
export default HomePage
