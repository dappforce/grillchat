import { CHAT_PER_PAGE } from '@/constants/chat'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { PostData } from '@subsocial/api/types'

type CacheType = {
  post: PostData
  commentIds: string[]
  comments: PostData[]
}
const cache: {
  [key: string]: {
    // promise to wait for the first subscription data is loaded
    promise: ReturnType<typeof generateManuallyTriggeredPromise<void>>
    cache: CacheType | null
    isSubscribed: boolean
  }
} = {}
export async function startSubscription(postId: string) {
  if (cache[postId]?.isSubscribed) return

  cache[postId] = {
    isSubscribed: true,
    cache: null,
    promise: generateManuallyTriggeredPromise(),
  }

  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi
  console.log('GET POST...')
  const post = await subsocialApi.findPost({
    id: postId,
    visibility: 'onlyPublic',
  })

  // TODO: better handling
  if (!post) return

  return new Promise<void>((resolve) => {
    const unsub = substrateApi.query.posts.replyIdsByPostId(
      postId,
      async (ids) => {
        console.log('NEW COMMENTIDS...')
        const promise = cache[postId].promise
        resolve()

        const commentIds = ids.map((id) => id.toString())

        const preloadedPostCount = CHAT_PER_PAGE
        const startSlice = Math.max(0, commentIds.length - preloadedPostCount)
        const endSlice = commentIds.length

        console.log('GET CHATS...')
        const prefetchedCommentIds = commentIds.slice(startSlice, endSlice)
        const posts = await subsocialApi.findPublicPosts(prefetchedCommentIds)

        cache[postId].cache = {
          commentIds,
          comments: posts,
          post,
        }
        promise.getResolver()()
      }
    )
  })
}

export async function getCache(postId: string) {
  const cached = cache[postId]
  await cached.promise.getPromise()

  return cached.cache
}
