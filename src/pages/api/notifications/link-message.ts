import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  createLinkingMessageForTelegram,
  createUnlinkingMessageForTelegram,
} from '@/server/notifications'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  address: z.string(),
  action: z.union([z.literal('link'), z.literal('unlink')], {
    invalid_type_error: 'Invalid action',
  }),
})
export type ApiNotificationsLinkMessageBody = z.infer<typeof bodySchema>

type ResponseData = {
  data: string
}
export type ApiNotificationsLinkMessageResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  errorLabel: 'link-message',
  handler: async (data, _, res) => {
    let message = ''
    if (data.action === 'link')
      message = await createLinkingMessageForTelegram(data.address)
    else message = await createUnlinkingMessageForTelegram(data.address)

    return res.status(200).send({
      success: true,
      message: 'OK',
      data: message,
    })
  },
})
