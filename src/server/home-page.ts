import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { PostData } from '@subsocial/api/types'
import { getCachedPosts } from './post-cache'

type CacheType = {
  commentIdsByPostIds: Record<string, string[]>
  postIdsBySpaceId: { spaceId: string; postIds: string[] }
  posts: PostData[]
}
const cache: {
  [key: string]: {
    // promise to wait for the first subscription data is loaded
    promise: ReturnType<typeof generateManuallyTriggeredPromise<void>>
    cache: CacheType | null
    isSubscribed: boolean
  }
} = {}
export async function startSubscription(spaceId: string) {
  if (cache[spaceId]?.isSubscribed) return

  cache[spaceId] = {
    isSubscribed: true,
    cache: null,
    promise: generateManuallyTriggeredPromise(),
  }

  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi

  const { getPromise, getResolver } = generateManuallyTriggeredPromise()
  const subscriptionPromise: Promise<void> = getPromise()
  let childSubscriptionPromises: Promise<void>[] = []

  const cacheData: CacheType = {
    commentIdsByPostIds: {},
    postIdsBySpaceId: { spaceId, postIds: [] },
    posts: [],
  }

  substrateApi.query.posts.postIdsBySpaceId(spaceId, async (postIds) => {
    cacheData.postIdsBySpaceId.postIds = postIds.map((id) => id.toString())

    childSubscriptionPromises = postIds.map(async (_postId) => {
      const postId = _postId.toString()
      const [post] = await getCachedPosts([postId])
      cacheData.posts.push(post)

      return new Promise<void>((resolve) => {
        const unsub = substrateApi.query.posts.replyIdsByPostId(
          postId,
          async (_commentIds) => {
            const commentIds = _commentIds.map((id) => id.toString())
            cacheData.commentIdsByPostIds[postId.toString()] = commentIds

            const lastPostId = commentIds[commentIds.length - 1].toString()
            const [lastPost] = await getCachedPosts([lastPostId])
            cacheData.posts.push(lastPost)
            resolve()
          }
        )
      })
    })
    getResolver()()
  })
  console.log('awaiting sub promise')
  await subscriptionPromise
  console.log('awaiting child promise')
  await Promise.all(childSubscriptionPromises)

  cacheData.posts = cacheData.posts.filter((post) => !!post)
  cache[spaceId].cache = cacheData
  cache[spaceId].promise.getResolver()()
}

export async function getCache(spaceId: string) {
  const cached = cache[spaceId]
  await cached.promise.getPromise()

  return cached.cache
}
