import { getAllTopics } from '@/constants/topics'
import HomePage from '@/modules/HomePage'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getCommonServerSideProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonServerSideProps<{
  dehydratedState: any
}>({}, async () => {
  const topics = Object.values(getAllTopics())
  const queryClient = new QueryClient()

  try {
    const subsocialApi = await getSubsocialApi()
    const promises = topics.map(({ postId }) => {
      return subsocialApi.blockchain.getReplyIdsByPostId(postId)
    })
    const commentIdsByPostId = await Promise.all(promises)
    const lastPostIds = commentIdsByPostId.map((ids) => ids[ids.length - 1])
    const lastPosts = await subsocialApi.findPosts({ ids: lastPostIds })

    commentIdsByPostId.forEach((commentIds, idx) => {
      queryClient.setQueryData(
        getCommentIdsQueryKey(topics[idx].postId),
        commentIds
      )
    })
    lastPosts.forEach((post) => {
      queryClient.setQueryData(getPostQuery.getQueryKey(post.id), () => post)
    })
  } catch (e) {
    console.error('Error fetching for home page: ', e)
  }

  return {
    dehydratedState: dehydrate(queryClient),
  }
})
export default HomePage
