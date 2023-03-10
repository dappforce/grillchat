import HomePage from '@/modules/HomePage'
import { getCache, startSubscription } from '@/server/home-page'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import {
  getPostIdsBySpaceIdQuery,
  getPostQuery,
} from '@/services/subsocial/posts'
import { getSpaceId } from '@/utils/env/client'
import { getCommonServerSideProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonServerSideProps<{
  dehydratedState: any
}>({}, async () => {
  const queryClient = new QueryClient()

  try {
    const spaceId = getSpaceId()
    console.log('waiting sub')
    await startSubscription(spaceId)

    console.log('waiting cache')
    const cachedData = await getCache(spaceId)
    console.log('finish getting cache', cachedData)
    if (!cachedData) return

    const { commentIdsByPostIds, postIdsBySpaceId, posts } = cachedData

    getPostIdsBySpaceIdQuery.setQueryData(
      queryClient,
      spaceId,
      postIdsBySpaceId
    )
    Object.entries(commentIdsByPostIds).forEach(([postId, commentIds], idx) => {
      queryClient.setQueryData(
        getCommentIdsQueryKey(postId),
        commentIds ?? null
      )
    })
    posts.forEach((post) => {
      getPostQuery.setQueryData(
        queryClient,
        post.id,
        JSON.parse(JSON.stringify(post))
      )
    })
  } catch (e) {
    console.error('Error fetching for home page: ', e)
  }

  return {
    dehydratedState: dehydrate(queryClient),
  }
})
export default HomePage
