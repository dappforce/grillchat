import { constantsConfig, getPinnedHubIds } from '@/constants/config'
import { env } from '@/env.mjs'
import HomePage, {
  HomePageProps,
  homePageAdditionalTabs,
} from '@/modules/chat/HomePage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts/query'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'

export const getStaticProps = getCommonStaticProps<
  HomePageProps & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async () => {
    const hubsChatCount: HomePageProps['hubsChatCount'] = {}
    const hubIds = Array.from(
      new Set([...getPinnedHubIds(), ...env.NEXT_PUBLIC_SPACE_IDS])
    )

    const queryClient = new QueryClient()

    try {
      const additionalHubIds = homePageAdditionalTabs.map(({ hubId }) => hubId)

      await Promise.all([
        getSpaceQuery.fetchQueries(queryClient, hubIds),
        prefetchChatPreviewsData(queryClient, env.NEXT_PUBLIC_MAIN_SPACE_ID),
        ...additionalHubIds.map((hubId) =>
          prefetchChatPreviewsData(queryClient, hubId)
        ),
        ...hubIds.map(async (hubId) => {
          const res = await getPostIdsBySpaceIdQuery.fetchQuery(null, hubId)
          const linkedChats = constantsConfig.linkedChatsForHubId[hubId] ?? []
          hubsChatCount[hubId] = (res?.postIds.length ?? 0) + linkedChats.length
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
