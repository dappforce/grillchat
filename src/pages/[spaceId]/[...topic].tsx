import { CHAT_PER_PAGE } from '@/constants/chat'
import ChatPage from '@/modules/_[spaceId]/ChatPage'
import { ChatPageProps } from '@/modules/_[spaceId]/ChatPage/ChatPage'
import { getPostsFromCache } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import {
  getBlockedIdsInRootPostId,
  getBlockedIdsInRootPostIdQuery,
} from '@/services/moderation/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getSpaceIds } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { createSlug, getIdFromSlug } from '@/utils/slug'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const spaceIds = getSpaceIds()
  const paths: Awaited<ReturnType<GetStaticPaths>>['paths'] = []

  spaceIds.forEach(async (spaceId) => {
    const subsocialApi = await getSubsocialApi()
    const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)
    const posts = await getPostsFromCache(postIds)

    posts.forEach((post) =>
      paths.push({
        params: { topic: [createSlug(post.id, post.content)] },
      })
    )
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

function getRoomIdAndChatId(topicParams: string[]) {
  if (topicParams.length <= 0 || topicParams.length > 2) {
    return undefined
  }

  const [topic, chatId] = topicParams
  const roomId = getIdFromSlug(topic)
  if (!roomId) return undefined

  const isInvalidChatId = chatId && isNaN(parseInt(chatId))
  if (isInvalidChatId) return undefined

  return [roomId, chatId] as const
}

async function getPostsData(roomId: string, chatId: string) {
  let roomIdAndChatId = [roomId]
  if (chatId) roomIdAndChatId.push(chatId)

  const [roomData, chatData] = await getPostsFromCache(roomIdAndChatId)

  const subsocialApi = await getSubsocialApi()
  const commentIds = await subsocialApi.blockchain.getReplyIdsByPostId(roomId)

  const preloadedPostCount = CHAT_PER_PAGE * 2
  const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
  const endSlice = commentIds.length
  const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
  const posts = await getPostsFromCache(prefetchedCommentIds)

  return { posts, roomData, chatData, commentIds }
}

export const getStaticProps = getCommonStaticProps<
  {
    dehydratedState: any
    title: string | null
    desc: string | null
  } & ChatPageProps
>(
  (data) => ({
    head: { disableZoom: true, title: data.title, description: data.desc },
  }),
  async (context) => {
    const topicParams = context.params?.topic as string[]
    const topicAndChatId = getRoomIdAndChatId(topicParams)
    if (!topicAndChatId) return undefined

    const [roomId, chatId] = topicAndChatId

    const queryClient = new QueryClient()

    let title: string | null = null
    let desc: string | null = null
    try {
      const [{ chatData, commentIds, posts, roomData }, blockedIds] =
        await Promise.all([
          await getPostsData(roomId, chatId),
          await getBlockedIdsInRootPostId(roomId),
        ] as const)

      title = roomData?.content?.title || null
      if (chatData) {
        title = `Message from ${title}`
        desc = chatData?.content?.body || null
      }

      getPostQuery.setQueryData(queryClient, roomId, roomData)
      getPostQuery.setQueryData(queryClient, chatId, chatData)

      queryClient.setQueryData(
        getCommentIdsQueryKey(roomId),
        commentIds ?? null
      )
      posts.forEach((post) => {
        getPostQuery.setQueryData(queryClient, post.id, post)
      })

      getBlockedIdsInRootPostIdQuery.setQueryData(
        queryClient,
        roomId,
        blockedIds
      )
    } catch (err) {
      console.error('Error fetching for topic page: ', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        postId: roomId,
        title,
        desc,
      },
      revalidate: 2,
    }
  }
)

export default ChatPage
