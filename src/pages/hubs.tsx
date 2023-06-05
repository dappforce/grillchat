import { getLinkedChatIdsForSpaceId } from '@/constants/chat-room'
import HubsPage from '@/modules/chat/HubsPage'
import { HubsPageProps } from '@/modules/chat/HubsPage/HubsPage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getChatIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getMainSpaceId, getSpaceIds } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getStaticProps = getCommonStaticProps<
  HubsPageProps & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async () => {
    const hubsChatCount: HubsPageProps['hubsChatCount'] = {}
    const hubIds = getSpaceIds()

    const queryClient = new QueryClient()

    try {
      const hubsData = await getSpaceQuery.fetchQueries(queryClient, hubIds)

      await Promise.all([
        prefetchChatPreviewsData(queryClient, getMainSpaceId()),
        ...hubsData.map(async (hub) => {
          if (!hub) return

          const res = await getChatIdsBySpaceIdQuery.fetchQuery(null, hub.id)
          const linkedChats = getLinkedChatIdsForSpaceId(hub.id)
          hubsChatCount[hub.id] =
            (res?.chatIds.length ?? 0) + linkedChats.length
        }),
      ])
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
export default HubsPage
