import { ApiResponse, handlerWrapper } from '@/server/common'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import { NextApiRequest } from 'next'
import { z } from 'zod'
import { datahubPostActionMapping } from './datahub/post'

const bodySchema = z.object({
  resourseURL: z.string(),
})

type ResponseData = {
  postId?: string
}
export type CreateResourcePostResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  errorLabel: 'create-resource-post',
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    let postId: string = ''

    const mapper = datahubMutationWrapper(datahubPostActionMapping)
    try {
      const callId = await mapper(data)
    } catch (e: any) {
      return res.status(500).send({
        message: '',
        success: false,
        errors: e.message,
      })
    }

    res.status(200).send({ success: true, message: 'OK', postId })
  },
})
