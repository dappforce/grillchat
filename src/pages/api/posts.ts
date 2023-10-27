import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { generateGetDataFromSquidWithBlockchainFallback } from '@/server/squid'
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

const INVALIDATED_MAX_AGE = 1 * 60 // 1 minute
const getInvalidatedPostRedisKey = (id: string) => {
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
      return redis?.set(
        getInvalidatedPostRedisKey(data.postId),
        data.postId,
        'EX',
        INVALIDATED_MAX_AGE
      )
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

const getPostsData = generateGetDataFromSquidWithBlockchainFallback(
  getPostsFromSubsocial,
  { paramToId: (param) => param, responseToId: (post) => post.id },
  {
    blockchainResponse: (post) => {
      if (!post.content) return
      const link = getUrlFromText(post.content.body)
      if (!link) return
      post.content.link = link
    },
  },
  getInvalidatedPostRedisKey
)
export async function getPostsServer(postIds: string[]) {
  const validPostIds = postIds.filter((id) => id && !isNaN(Number(id)))
  const posts = await getPostsData(validPostIds)

  const linksToFetch = new Set<string>()
  posts.forEach((post) => {
    post.struct.ownerId = toSubsocialAddress(post.struct.ownerId)!
    if (post.content?.link) linksToFetch.add(post.content.link)
  })

  const metadataMap: Record<string, LinkMetadata> = {}
  const metadataPromises = Array.from(linksToFetch).map(async (link) => {
    const metadata = await getLinkMetadata(link)
    if (metadata) metadataMap[link] = metadata
  })
  await Promise.allSettled(metadataPromises)

  posts.forEach((post) => {
    const link = post.content?.link
    const linkMetadata = metadataMap[link ?? '']
    if (!linkMetadata || !post.content) return

    post.content.linkMetadata = linkMetadata
  })

  return posts
}

const getMetadataRedisKey = (url: string) => 'metadata:' + url
const METADATA_MAX_AGE = 60 * 60 * 24 * 30 // 1 month
const METADATA_ERROR_MAX_AGE = 60 * 60 * 24 // 1 day
async function getLinkMetadata(link: string): Promise<LinkMetadata | null> {
  const cachedData = await redisCallWrapper((redis) =>
    redis?.get(getMetadataRedisKey(link))
  )
  if (cachedData) {
    return JSON.parse(cachedData) as LinkMetadata
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
    redisCallWrapper((redis) =>
      redis?.set(
        getMetadataRedisKey(link),
        JSON.stringify(null),
        'EX',
        METADATA_ERROR_MAX_AGE
      )
    )
    return null
  }
}
