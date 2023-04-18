import HomePage from '@/modules/HomePage'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getSpaceId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { PostData } from '@subsocial/api/types'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getPostsFromCache } from './api/posts'

const getLastPosts = async (commentIdsByPostId: string[][]) => {
  const lastPostIds = commentIdsByPostId
    .map((ids) => ids[ids.length - 1])
    .filter((id) => !!id)

  let lastPosts: PostData[] = []
  if (lastPostIds.length > 0) {
    lastPosts = await getPostsFromCache(lastPostIds)
  }
  return lastPosts
}

export const getStaticProps = getCommonStaticProps<{
  dehydratedState: any
  isIntegrateChatButtonOnTop: boolean
}>(
  () => ({}),
  async () => {
    const queryClient = new QueryClient()

    try {
      const spaceId = getSpaceId()
      const subsocialApi = await getSubsocialApi()
      const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)

      const promises = postIds.map((postId) => {
        return subsocialApi.blockchain.getReplyIdsByPostId(postId)
      })
      const postsPromise = getPostsFromCache(postIds)

      const commentIdsByPostId = await Promise.all(promises)
      const posts = await postsPromise

      const lastPosts = await getLastPosts(commentIdsByPostId)

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
      props: {
        dehydratedState: dehydrate(queryClient),
        isIntegrateChatButtonOnTop: Math.random() > 0.5,
      },
      revalidate: 2,
    }
  }
)
export default HomePage
