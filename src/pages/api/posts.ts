import { contentCache, postsCache } from '@/modules/_api/cache'
import { ApiResponse } from '@/modules/_api/types'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import {
  IpfsCommonContent,
  PostContent,
  PostData,
  PostStruct,
} from '@subsocial/api/types'
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { z } from 'zod'

const querySchema = z.object({
  postIds: z.array(z.string()),
})
export type ApiPostsParams = z.infer<typeof querySchema>
export type ApiPostsResponse = ApiResponse<{
  data?: PostData[]
}>

async function getPostStructsFromCache(postIds: string[]) {
  const postsFromCache: PostStruct[] = []
  const needToFetchIds: string[] = []

  let newlyFetchedData: PostStruct[] = []
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
      newlyFetchedData = await subsocialApi.findPostStructs(needToFetchIds)
      newlyFetchedData.forEach((post) => {
        postsCache.add(post.id.toString(), post)
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

type PostStructWithContent = PostStruct & { contentId: string }
function isPostValid(post: PostStruct): post is PostStructWithContent {
  return post.hidden === false && post.contentId !== undefined
}

export async function getPostsFromCache(
  postIds: string[]
): Promise<PostData[]> {
  const validIds = postIds.filter((id) => !!id && parseInt(id) >= 0)
  const posts = await getPostStructsFromCache(validIds)
  const contentMap: { [key: string]: IpfsCommonContent } = {}
  const needToFetchContentIds: string[] = []
  posts.forEach((post) => {
    if (!isPostValid(post)) return
    const cid = post.contentId
    const content = contentCache.get(cid)
    if (!content) {
      needToFetchContentIds.push(cid)
    } else {
      contentMap[cid] = content
    }
  })

  let newlyFetchedContents: { [key: string]: IpfsCommonContent } = {}
  if (needToFetchContentIds.length > 0) {
    const api = await getSubsocialApi()
    newlyFetchedContents = await api.ipfs.getContentArray(
      needToFetchContentIds,
      10_000
    )
    Object.entries(newlyFetchedContents).forEach(([cid, content]) => {
      contentCache.add(cid, content as PostContent)
    })
  }

  const allContents = { ...newlyFetchedContents, ...contentMap }

  const publicPostsData: PostData[] = []
  posts.forEach((post) => {
    if (!isPostValid(post)) return
    const cid = post.contentId
    const content = allContents[cid] as PostContent | undefined
    publicPostsData.push({
      struct: post,
      id: post.id,
      content: content ?? null,
    })
  })
  return publicPostsData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiPostsResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  await NextCors(req, res, {
    methods: ['GET'],
    origin: '*',
  })

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

  const posts = await getPostsFromCache(params.data.postIds)
  return res.status(200).send({ success: true, message: 'OK', data: posts })
}
