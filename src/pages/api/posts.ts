import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getPostsFromSubsocial } from '@/services/subsocial/posts/fetcher'
import { getUrlFromText } from '@/utils/strings'
import { LinkMetadata, PostData } from '@subsocial/api/types'
import { toSubsocialAddress } from '@subsocial/utils'
import { parser } from 'html-metadata-parser'
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

const MAX_AGE = 1 * 60 // 1 minute
const getRedisKey = (id: string) => {
  return `posts-invalidated:${id}`
}

const GET_handler = handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const postIds = Array.isArray(data.postIds) ? data.postIds : [data.postIds]
    const posts = await getPostsServer(postIds)
    return res.status(200).send({ success: true, message: 'OK', data: posts })
  },
})

const POST_handler = handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<{}>({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    redisCallWrapper(async (redis) => {
      return redis?.set(getRedisKey(data.postId), data.postId, 'EX', MAX_AGE)
    })

    return res.status(200).send({ success: true, message: 'OK' })
  },
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  } else if (req.method === 'POST') {
    return POST_handler(req, res)
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
    postsFromBlockchain.forEach((post) => {
      if (!post.content) return
      const link = getUrlFromText(post.content.body)
      if (!link) return
      post.content.link = link
    })
    mergedPosts.push(...postsFromBlockchain)
  } catch (e) {
    console.error('Error fetching posts from blockchain', e)
  }

  const filteredPosts = mergedPosts.filter((post) => !!post)
  const linksToFetch = new Set<string>()
  filteredPosts.forEach((post) => {
    post.struct.ownerId = toSubsocialAddress(post.struct.ownerId)!
    if (post.content?.link) linksToFetch.add(post.content.link)
  })

  const metadataMap: Record<string, LinkMetadata> = {}
  const metadataPromises = Array.from(linksToFetch).map(async (link) => {
    const metadata = await getLinkMetadata(link)
    if (metadata) metadataMap[link] = metadata
  })
  await Promise.allSettled(metadataPromises)

  filteredPosts.forEach((post) => {
    const link = post.content?.link
    const linkMetadata = metadataMap[link ?? '']
    if (!linkMetadata || !post.content) return

    post.content.linkMetadata = linkMetadata
  })

  return filteredPosts
}

async function addMetadataToPost(post: PostData) {
  const link = post.content?.link
  if (!link) return

  const metadata = await getLinkMetadata(link)
  if (metadata) post.content!.linkMetadata = metadata
}

const getMetadataRedisKey = (url: string) => 'metadata:' + url
const METADATA_MAX_AGE = 60 * 60 * 24 * 30 // 1 month
async function getLinkMetadata(link: string): Promise<LinkMetadata | null> {
  const cachedData = await redisCallWrapper((redis) =>
    redis?.get(getMetadataRedisKey(link))
  )
  if (cachedData) {
    return JSON.parse(cachedData)
  }

  try {
    const metadata = await parser(link, { timeout: 5_000 })
    const allMetadata = {
      ...metadata.meta,
      ...metadata.og,
    }
    const parsedMetadata: LinkMetadata = allMetadata
    if (allMetadata.site_name) {
      parsedMetadata.siteName = allMetadata.site_name
    }

    redisCallWrapper((redis) =>
      redis?.set(
        getMetadataRedisKey(link),
        JSON.stringify(parsedMetadata),
        'EX',
        METADATA_MAX_AGE
      )
    )
    return parsedMetadata
  } catch (err) {
    console.error('Error fetching page metadata for link: ', link)
    return null
  }
}
