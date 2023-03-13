import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { PostData } from '@subsocial/api/types'
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { z } from 'zod'

const querySchema = z.object({
  postIds: z.array(z.string()),
})
export type PostsQuery = z.infer<typeof querySchema>
export type PostsResponse = {
  success: boolean
  message: string
  errors?: any
  data?: PostData[]
  hash?: string
}

const postsCache = new Map<string, PostData>()
async function getPostsFromCache(postIds: string[]) {
  const postsFromCache: PostData[] = []
  const needToFetchIds: string[] = []

  let newlyFetchedData: PostData[] = []
  postIds.forEach((id) => {
    const cachedData = postsCache.get(id)
    if (cachedData) {
      postsFromCache.push(cachedData)
    } else {
      needToFetchIds.push(id)
    }
  })
  if (needToFetchIds.length > 0) {
    try {
      const subsocialApi = await getSubsocialApi()
      newlyFetchedData = await subsocialApi.findPublicPosts(needToFetchIds)
      newlyFetchedData.forEach((post) => {
        postsCache.set(post.id.toString(), post)
      })
    } catch (e) {
      console.error(
        'Error fetching posts from Subsocial API: ',
        needToFetchIds,
        e
      )
      return postsFromCache
    }
  }
  return [...postsFromCache, ...newlyFetchedData]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostsResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  await NextCors(req, res, {
    methods: ['GET'],
    origin: '*',
  })

  const params = querySchema.safeParse(req.query)
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const posts = await getPostsFromCache(params.data.postIds)
  return res.status(200).send({ success: true, message: 'OK', data: posts })
}
