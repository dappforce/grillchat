import ChatPage from '@/modules/_chats/ChatPage'
import { getCache, startSubscription } from '@/modules/_chats/ChatPage/server'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
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
    await startSubscription(postId)
    const cacheData = await getCache(postId)
    if (!cacheData) return undefined

    getPostQuery.setQueryData(queryClient, postId, cacheData.post)
    queryClient.setQueryData(
      getCommentIdsQueryKey(postId),
      cacheData.commentIds ?? null
    )
    cacheData.comments.forEach((post) => {
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
