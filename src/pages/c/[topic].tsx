import { CHAT_PER_PAGE } from '@/constants/chat'
import ChatPage from '@/modules/_c/ChatPage'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getSpaceId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { createSlug, getIdFromSlug } from '@/utils/slug'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'
import { getPostsFromCache } from '../api/posts'

export const getStaticPaths: GetStaticPaths = async () => {
  const spaceId = getSpaceId()
  const subsocialApi = await getSubsocialApi()
  const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)
  const posts = await getPostsFromCache(postIds)

  const paths = posts.map((post) => ({
    params: { topic: createSlug(post.id, post.content) },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<{
  dehydratedState: any
  postId: string
  title: string | null
}>(
  (data) => ({ head: { disableZoom: true, title: data.title } }),
  async (context) => {
    const topic = context.params?.topic as string
    const postId = getIdFromSlug(topic)
    if (!postId) return undefined

    const queryClient = new QueryClient()

    let title: string | null = null
    try {
      const [post] = await getPostsFromCache([postId])
      title = post?.content?.title || null

      const subsocialApi = await getSubsocialApi()
      const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(
        postId
      )

      const preloadedPostCount = CHAT_PER_PAGE * 2
      const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
      const endSlice = commentIds.length
      const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
      const posts = await getPostsFromCache(prefetchedCommentIds)

      getPostQuery.setQueryData(queryClient, postId, post)
      queryClient.setQueryData(
        getCommentIdsQueryKey(postId),
        commentIds ?? null
      )
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
        title,
      },
      revalidate: 2,
    }
  }
)

export default ChatPage
