import { getPostsFromSubsocial } from '@/services/subsocial/posts/fetcher'
import { PostData } from '@subsocial/api/types'
import { toSubsocialAddress } from '@subsocial/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  postIds: z.array(z.string()),
})
export type ApiPostsParams = z.infer<typeof querySchema>
export type ApiPostsResponse = {
  success: boolean
  message: string
  errors?: any
  data?: PostData[]
  hash?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiPostsResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  const query = req.query.postIds
  const params = querySchema.safeParse({
    postIds: Array.isArray(query) ? query : [query],
  })
  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const posts = await getPostsServer(params.data.postIds)
  return res.status(200).send({ success: true, message: 'OK', data: posts })
}

export async function getPostsServer(postIds: string[]): Promise<PostData[]> {
  const validIds = postIds.filter((id) => !!id && parseInt(id) >= 0)

  let posts: PostData[] = []
  try {
    posts = await getPostsFromSubsocial(validIds)
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
