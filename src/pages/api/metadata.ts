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

export default handlerWrapper({
  inputSchema: paramSchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const metadata = await parser(data.url)
    const allMetadata = {
      ...metadata.meta,
      ...metadata.og,
    }
    const parsedMetadata: ResponseData['data'] = {
      ...allMetadata,
      siteName: allMetadata.site_name,
    }
    res.status(200).send({ success: true, message: 'OK', data: parsedMetadata })
  },
})
