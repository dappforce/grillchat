import HomePage from '@/modules/HomePage'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import {
  getPostIdsBySpaceIdQuery,
  getPostQuery,
} from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getSpaceId } from '@/utils/env/client'
import { getCommonServerSideProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonServerSideProps<{
  dehydratedState: any
}>({}, async () => {
  const queryClient = new QueryClient()

  try {
    const spaceId = getSpaceId()
    const subsocialApi = await getSubsocialApi()
    const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)

    const promises = postIds.map((postId) => {
      return subsocialApi.blockchain.getReplyIdsByPostId(postId)
    })
    const postsPromise = subsocialApi.findPublicPosts(postIds)

    const commentIdsByPostId = await Promise.all(promises)
    const posts = await postsPromise

    const lastPostIds = commentIdsByPostId.map((ids) => ids[ids.length - 1])
    const lastPosts = await subsocialApi.findPosts({ ids: lastPostIds })

    getPostIdsBySpaceIdQuery.setQueryData(queryClient, spaceId, {
      spaceId,
      postIds,
    })
    commentIdsByPostId.forEach((commentIds, idx) => {
      queryClient.setQueryData(
        getCommentIdsQueryKey(postIds[idx]),
        commentIds ?? null
      )
    })
    ;[...lastPosts, ...posts].forEach((post) => {
      getPostQuery.setQueryData(queryClient, post.id, post)
    })
  } catch (e) {
    console.error('Error fetching for home page: ', e)
  }

  return {
    dehydratedState: dehydrate(queryClient),
  }
})
export default HomePage
