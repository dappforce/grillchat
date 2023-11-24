import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import HomePage, {
  homePageAdditionalTabs,
  HubsPageProps,
} from '@/modules/chat/HomePage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getHubIds, getMainHubId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getServerSession } from 'next-auth/next'

export const getStaticProps = getCommonStaticProps<
  HubsPageProps & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async () => {
    const session = getServerSession()
    console.log('>>>>>>>>>>>>>>>>> session', session)
    const hubsChatCount: HubsPageProps['hubsChatCount'] = {}
    const hubIds = getHubIds()

    const queryClient = new QueryClient()

    try {
      const hubsData = await getSpaceQuery.fetchQueries(queryClient, hubIds)

      const additionalHubIds = homePageAdditionalTabs.map(({ hubId }) => hubId)

      await Promise.all([
        prefetchChatPreviewsData(queryClient, getMainHubId()),
        ...additionalHubIds.map((hubId) =>
          prefetchChatPreviewsData(queryClient, hubId)
        ),
        ...hubsData.map(async (hub) => {
          if (!hub) return

          const res = await getPostIdsBySpaceIdQuery.fetchQuery(null, hub.id)
          const linkedChats = getLinkedChatIdsForHubId(hub.id)
          hubsChatCount[hub.id] =
            (res?.postIds.length ?? 0) + linkedChats.length
        }),
      ])
    } catch (err) {
      console.error('Error fetching for home page: ', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        hubsChatCount,
      },
      revalidate: 2,
    }
  }
)
export default HomePage
