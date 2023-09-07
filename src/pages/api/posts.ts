import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getPostsFromDatahub } from '@/services/datahub/posts/fetcher'
import { LinkMetadata, PostData } from '@subsocial/api/types'
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
  return getPostsFromDatahub(validIds)
}

const getMetadataRedisKey = (url: string) => 'metadata:' + url
const METADATA_MAX_AGE = 60 * 60 * 24 * 30 // 1 month
const METADATA_ERROR_MAX_AGE = 60 * 60 * 24 // 1 day
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
