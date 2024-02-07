import { getHubIdFromAlias } from '@/constants/config'
import HubPage, { HubPageProps } from '@/modules/chat/HubPage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getMainHubId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { validateNumber } from '@/utils/strings'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getStaticPaths = async () => {
  // Skip pre-rendering, because it will cause slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

function getHubIdFromParam(paramSpaceId: string) {
  const hubIdOrAlias = paramSpaceId ?? getMainHubId()
  let hubId = hubIdOrAlias
  if (!validateNumber(hubIdOrAlias)) {
    const hubIdFromAlias = getHubIdFromAlias(hubIdOrAlias)
    if (hubIdFromAlias) {
      hubId = hubIdFromAlias
    } else {
      return undefined
    }
  }
  return hubId
}

export const getStaticProps = getCommonStaticProps<
  HubPageProps & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async (context) => {
    const queryClient = new QueryClient()

    let { hubId: paramHubId } = context.params ?? {}
    const hubId = getHubIdFromParam(paramHubId as string)
    if (!hubId) return undefined

    try {
      await prefetchChatPreviewsData(queryClient, hubId)
    } catch (e) {
      console.error('Error fetching for hub page: ', e)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        hubId,
      },
      revalidate: 2,
    }
  }
)
export default HubPage
