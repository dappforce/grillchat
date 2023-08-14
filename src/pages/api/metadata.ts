import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { parser } from 'html-metadata-parser'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const paramSchema = z.object({
  url: z.string(),
})

type ResponseData = {
  data: {
    title?: string
    description?: string
    image?: string
    siteName?: string
    hostName?: string
  }
}
export type ApiMetadataResponse = ApiResponse<ResponseData>

const getRedisKey = (url: string) => 'metadata:' + url
const MAX_AGE = 60 * 60 * 24 * 7 // 1 week

export default handlerWrapper({
  inputSchema: paramSchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const cachedData = await redisCallWrapper((redis) =>
      redis?.get(getRedisKey(data.url))
    )
    if (cachedData) {
      return res
        .status(200)
        .send({ success: true, message: 'OK', data: JSON.parse(cachedData) })
    }

    const metadata = await parser(data.url)
    const allMetadata = {
      ...metadata.meta,
      ...metadata.og,
    }
    const parsedMetadata: ResponseData['data'] = {
      ...allMetadata,
      siteName: allMetadata.site_name,
    }

    redisCallWrapper((redis) =>
      redis?.set(
        getRedisKey(data.url),
        JSON.stringify(parsedMetadata),
        'EX',
        MAX_AGE
      )
    )
    res.status(200).send({ success: true, message: 'OK', data: parsedMetadata })
  },
})
