import ViewPostPage from '@/modules/PostPage'
import { AppCommonProps } from '@/pages/_app'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getStaticPaths = async () => {
  // Skip pre-rendering, because it will cause slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async (context) => {
    const queryClient = new QueryClient()

    let { spaceId: spaceIdParam, slug } = context.params ?? {}

    const spaceId = spaceIdParam as string | undefined
    if (!spaceId) return undefined

    try {
      await getSpaceQuery.fetchQuery(queryClient, spaceId)
    } catch (e) {
      console.error('Error fetching for space page: ', e)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        postId: slug,
      },
      revalidate: 2,
    }
  }
)

export default ViewPostPage
