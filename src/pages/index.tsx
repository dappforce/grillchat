import HomePage from '@/modules/HomePage'
import { getPostQuery, getPosts } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getSpaceId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getStaticProps = getCommonStaticProps<{
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
    const postsPromise = getPosts(postIds)

    const commentIdsByPostId = await Promise.all(promises)
    const posts = await postsPromise

    const lastPostIds = commentIdsByPostId.map((ids) => ids[ids.length - 1])
    const lastPosts = await getPosts(lastPostIds)

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
    },
    revalidate: 2,
  }
})
export default HomePage
