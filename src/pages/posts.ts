import FeedPage, { FeedPageProps } from '@/modules/FeedPage'
import { getPostQuery } from '@/services/api/query'
import { getHotPosts } from '@/services/datahub/hot-posts/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { AppCommonProps } from './_app'

export const getStaticProps = getCommonStaticProps<
  FeedPageProps & AppCommonProps
>(
  () => ({}),
  async () => {
    const queryClient = new QueryClient()

    const hotPostsData = await getHotPosts({
      limit: 20,
      offset: 0,
    })

    const initialPostIds = hotPostsData.data.map(
      (post) => post.persistentPostId
    )
    const postsCount = hotPostsData.total
    await getPostQuery.fetchQueries(queryClient, initialPostIds)

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialPostIds,
        postsCount,
        head: {
          title: '',
          description: '',
          image: '',
        },
      },
      revalidate: 2,
    }
  }
)

export default FeedPage
