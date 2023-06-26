import { ApiResponse, handlerWrapper } from '@/server/common'
import { createTemporaryLinkingUrlForTelegram } from '@/server/notifications'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  signedMessageWithDetails: z.string(),
})
export type ApiNotificationsLinkUrlBody = z.infer<typeof bodySchema>

type ResponseData = {
  url: string
}
export type ApiNotificationsLinkUrlResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  errorLabel: 'link-url',
  handler: async (data, _, res) => {
    const url = await createTemporaryLinkingUrlForTelegram(
      data.signedMessageWithDetails
    )

    return res.status(200).send({
      success: true,
      message: 'OK',
      url,
    })
  },
})
