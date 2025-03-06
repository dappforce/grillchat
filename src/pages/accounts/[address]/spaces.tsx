import SpacesPage from '@/modules/SpacesPage'
import { AppCommonProps } from '@/pages/_app'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getSpaceByOwnerQuery } from '../../../services/datahub/spaces/query'

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

    let { address } = context.params ?? {}

    if (!address) return undefined
    // const spaceIds = ['0x6c414d3f64a4644423a25bd362d4623a']
    const spaces = await getSpaceByOwnerQuery.fetchQuery(
      queryClient,
      address as string
    )

    const spaceIds = spaces?.map((space) => space.id) || []

    try {
    } catch (e) {
      console.error('Error fetching for space page: ', e)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        spaceIds,
      },
      revalidate: 2,
    }
  }
)

export default SpacesPage
