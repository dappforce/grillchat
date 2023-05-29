import { getSpaceIdFromAlias } from '@/constants/chat-room'
import HomePage, { HomePageProps } from '@/modules/chat/HomePage'
import { prefetchChatPreviewsData } from '@/server/chats'
import { getMainSpaceId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { validateNumber } from '@/utils/strings'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { AppCommonProps } from '../_app'

export const getStaticPaths = async () => {
  // Skip pre-rendering, because it will cause slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

function getSpaceIdFromParam(paramSpaceId: string) {
  const spaceIdOrAlias = paramSpaceId ?? getMainSpaceId()
  let spaceId = spaceIdOrAlias
  if (!validateNumber(spaceIdOrAlias)) {
    const spaceIdFromAlias = getSpaceIdFromAlias(spaceIdOrAlias)
    if (spaceIdFromAlias) {
      spaceId = spaceIdFromAlias
    } else {
      return undefined
    }
  }
  return spaceId
}

export const getStaticProps = getCommonStaticProps<
  HomePageProps & AppCommonProps
>(
  () => ({}),
  async (context) => {
    const queryClient = new QueryClient()

    let { spaceId: paramSpaceId } = context.params ?? {}
    const spaceId = getSpaceIdFromParam(paramSpaceId as string)
    if (!spaceId) return undefined

    try {
      await prefetchChatPreviewsData(queryClient, spaceId)
    } catch (e) {
      console.error('Error fetching for home page: ', e)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        hubId: spaceId,
      },
      revalidate: 2,
    }
  }
)
export default HomePage
