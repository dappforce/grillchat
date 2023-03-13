import { CHAT_PER_PAGE } from '@/constants/chat'
import ChatPage from '@/modules/_chats/ChatPage'
import { getPostQuery, getPosts } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getSpaceId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { createPostSlug, getPostIdFromSlug } from '@subsocial/utils/slugify'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const spaceId = getSpaceId()
  const subsocialApi = await getSubsocialApi()
  const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)
  const posts = await getPosts(postIds)

  const paths = posts.map((post) => ({
    params: { topic: createPostSlug(post.id, post.content) },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<{
  dehydratedState: any
  postId: string
}>({ head: { disableZoom: true } }, async (context) => {
  const topic = context.params?.topic as string
  const postId = getPostIdFromSlug(topic)
  if (!postId) return undefined

  const queryClient = new QueryClient()

  try {
    const [post] = await getPosts([postId])
    console.log(post)
    if (post?.struct.spaceId !== getSpaceId()) return undefined

    const subsocialApi = await getSubsocialApi()
    const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(postId)

    const preloadedPostCount = CHAT_PER_PAGE * 2
    const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
    const endSlice = commentIds.length
    const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
    const posts = await getPosts(prefetchedCommentIds)

    getPostQuery.setQueryData(queryClient, postId, post)
    queryClient.setQueryData(getCommentIdsQueryKey(postId), commentIds ?? null)
    posts.forEach((post) => {
      getPostQuery.setQueryData(queryClient, post.id, post)
    })
  } catch (err) {
    console.error('Error fetching for topic page: ', err)
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      postId,
    },
    revalidate: 2,
  }
})

export default ChatPage
