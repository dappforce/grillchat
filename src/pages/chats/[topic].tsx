import { getTopicId } from '@/constants/topics'
import ChatPage from '@/modules/_chats/ChatPage'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getCommonServerSideProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonServerSideProps<{
  dehydratedState: any
}>({}, async (context) => {
  const { query } = context
  const subsocialApi = await getSubsocialApi()
  const postId = getTopicId(query.topic as any)

  const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(postId)

  const preloadedPostCount = 15
  const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
  const endSlice = commentIds.length
  const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
  const posts = await subsocialApi.findPublicPosts(prefetchedCommentIds)

  const queryClient = new QueryClient()
  await queryClient.fetchQuery(getCommentIdsQueryKey(postId), () => commentIds)
  await Promise.all(
    posts.map(async (post) => {
      await queryClient.fetchQuery(
        getPostQuery.getQueryKey(post.id),
        () => post
      )
    })
  )

  return {
    dehydratedState: dehydrate(queryClient),
  }
})

export default ChatPage
