import { ApiResponse, handlerWrapper } from '@/server/common'
import { getPostsFromSubsocial } from '@/services/subsocial/posts/fetcher'
import { PostData } from '@subsocial/api/types'
import { toSubsocialAddress } from '@subsocial/utils'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  postIds: z.array(z.string()),
})
export type ApiPostsParams = z.infer<typeof querySchema>

type ResponseData = {
  data?: PostData[]
  hash?: string
}
export type ApiPostsResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const posts = await getPostsServer(data.postIds)
    return res.status(200).send({ success: true, message: 'OK', data: posts })
  },
})

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
