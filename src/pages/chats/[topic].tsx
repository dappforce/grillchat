import { CHAT_PER_PAGE } from '@/constants/chat'
import ChatPage from '@/modules/_chats/ChatPage'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getSpaceId } from '@/utils/env/client'
import { getCommonServerSideProps } from '@/utils/page'
import { getPostIdFromSlug } from '@subsocial/utils/slugify'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonServerSideProps<{
  dehydratedState: any
  postId: string
}>({}, async (context) => {
  const { query } = context
  const topic = query.topic as string
  const postId = getPostIdFromSlug(topic)
  if (!postId) return undefined

  const queryClient = new QueryClient()

  try {
    const subsocialApi = await getSubsocialApi()
    const post = await subsocialApi.findPost({
      id: postId,
      visibility: 'onlyPublic',
    })
    if (post?.struct.spaceId !== getSpaceId()) return undefined

    const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(postId)

    const preloadedPostCount = CHAT_PER_PAGE
    const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
    const endSlice = commentIds.length
    const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
    const posts = await subsocialApi.findPublicPosts(prefetchedCommentIds)

    getPostQuery.setQueryData(queryClient, postId, post)
    queryClient.setQueryData(getCommentIdsQueryKey(postId), commentIds ?? null)
    posts.forEach((post) => {
      getPostQuery.setQueryData(queryClient, post.id, post)
    })
  } catch (err) {
    console.error('Error fetching for topic page: ', err)
  }

  return {
    dehydratedState: dehydrate(queryClient),
    postId,
  }
})

export default ChatPage
