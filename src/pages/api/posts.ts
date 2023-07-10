import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getPostsFromSubsocial } from '@/services/subsocial/posts/fetcher'
import { PostData } from '@subsocial/api/types'
import { toSubsocialAddress } from '@subsocial/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  postIds: z.array(z.string()).or(z.string()),
})
export type ApiPostsParams = z.infer<typeof querySchema>

const bodySchema = z.object({
  postId: z.string(),
})
export type ApiPostsInvalidationBody = z.infer<typeof bodySchema>

type ResponseData = {
  data?: PostData[]
  hash?: string
}
export type ApiPostsResponse = ApiResponse<ResponseData>
export type ApiPostsInvalidationResponse = ApiResponse<{}>

const MAX_AGE = 1 // 1 minute
const getRedisKey = (id: string) => {
  return `posts-invalidated:${id}`
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    handlerWrapper({
      inputSchema: querySchema,
      dataGetter: (req: NextApiRequest) => req.query,
    })<ResponseData>({
      allowedMethods: ['GET'],
      handler: async (data, _, res) => {
        const postIds = Array.isArray(data.postIds)
          ? data.postIds
          : [data.postIds]
        const posts = await getPostsServer(postIds)
        return res
          .status(200)
          .send({ success: true, message: 'OK', data: posts })
      },
    })
  } else if (req.method === 'POST') {
    handlerWrapper({
      inputSchema: bodySchema,
      dataGetter: (req: NextApiRequest) => req.body,
    })<{}>({
      allowedMethods: ['POST'],
      handler: async (data, _, res) => {
        redisCallWrapper(async (redis) => {
          return redis?.set(
            getRedisKey(data.postId),
            data.postId,
            'EX',
            MAX_AGE
          )
        })

        return res.status(200).send({ success: true, message: 'OK' })
      },
    })
  }
}

export async function getPostsServer(postIds: string[]): Promise<PostData[]> {
  const validIds = postIds.filter((id) => !!id && parseInt(id) >= 0)

  let posts: PostData[] = []

  const canFetchedUsingSquid: string[] = []
  await Promise.all(
    validIds.map(async (id) => {
      return redisCallWrapper(async (redis) => {
        const isInvalidated = await redis?.get(getRedisKey(id))
        if (!isInvalidated) canFetchedUsingSquid.push(id)
      })
    })
  )

  try {
    posts = await getPostsFromSubsocial(canFetchedUsingSquid)
  } catch (e) {
    console.error('Error fetching posts from squid', e)
  }

  const foundPostIds = new Set()
  posts.forEach((post) => foundPostIds.add(post.id))

  const notFoundPostIds = validIds.filter((id) => !foundPostIds.has(id))

  const mergedPosts = posts
  try {
    const postsFromBlockchain = await getPostsFromSubsocial(
      notFoundPostIds,
      'blockchain'
    )
    mergedPosts.push(...postsFromBlockchain)
  } catch (e) {
    console.error('Error fetching posts from blockchain', e)
  }

  const filteredPosts = mergedPosts.filter((post) => !!post)
  filteredPosts.forEach((post) => {
    post.struct.ownerId = toSubsocialAddress(post.struct.ownerId)!
  })

  return filteredPosts
}
