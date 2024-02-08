import { constantsConfig } from '@/constants/config'
import { env } from '@/env.mjs'
import HomePage, {
  homePageAdditionalTabs,
  HubsPageProps,
} from '@/modules/chat/HomePage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getStaticProps = getCommonStaticProps<
  HubsPageProps & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async () => {
    const hubsChatCount: HubsPageProps['hubsChatCount'] = {}
    const hubIds = env.NEXT_PUBLIC_SPACE_IDS

    const queryClient = new QueryClient()

    try {
      const hubsData = await getSpaceQuery.fetchQueries(queryClient, hubIds)

      const additionalHubIds = homePageAdditionalTabs.map(({ hubId }) => hubId)

      await Promise.all([
        prefetchChatPreviewsData(queryClient, env.NEXT_PUBLIC_MAIN_SPACE_ID),
        ...additionalHubIds.map((hubId) =>
          prefetchChatPreviewsData(queryClient, hubId)
        ),
        ...hubsData.map(async (hub) => {
          if (!hub) return

          const res = await getPostIdsBySpaceIdQuery.fetchQuery(null, hub.id)
          const linkedChats = constantsConfig.linkedChatsForHubId[hub.id] ?? []
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
