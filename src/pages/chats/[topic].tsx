import { getTopicData, isSupportedTopic, Topic } from '@/constants/topics'
import ChatPage from '@/modules/_chats/ChatPage'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getCommonServerSideProps } from '@/utils/page'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export const getServerSideProps = getCommonServerSideProps<{
  dehydratedState: any
  topic: Topic
}>({}, async (context) => {
  const { query } = context
  const topic = query.topic as string
  const isSupported = isSupportedTopic(topic)
  if (!isSupported) return undefined

  const topicData = getTopicData(topic)
  const queryClient = new QueryClient()

  try {
    const subsocialApi = await getSubsocialApi()
    const { postId } = topicData

    const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(postId)

    const preloadedPostCount = 15
    const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
    const endSlice = commentIds.length
    const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
    const posts = await subsocialApi.findPublicPosts(prefetchedCommentIds)

    queryClient.setQueryData(getCommentIdsQueryKey(postId), commentIds)
    posts.forEach((post) => {
      queryClient.setQueryData(getPostQuery.getQueryKey(post.id), post)
    })
  } catch (err) {
    console.error('Error fetching for topic page: ', err)
  }

  return {
    dehydratedState: dehydrate(queryClient),
    topic: topicData,
  }
})

export default ChatPage
