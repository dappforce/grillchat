import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  createTemporaryLinkingUrlForTelegram,
  unlinkTelegramAccount,
} from '@/server/notifications'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  signedMessageWithDetails: z.string(),
  action: z.union([z.literal('link'), z.literal('unlink')], {
    invalid_type_error: 'Invalid action',
  }),
})
export type ApiNotificationsLinkUrlBody = z.infer<typeof bodySchema>

type ResponseData = {
  url?: string
}
export type ApiNotificationsLinkUrlResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  errorLabel: 'link-url',
  handler: async (data, _, res) => {
    if (data.action === 'link') {
      const url = await createTemporaryLinkingUrlForTelegram(
        data.signedMessageWithDetails
      )

      return res.status(200).send({
        success: true,
        message: 'OK',
        url,
      })
    } else {
      await unlinkTelegramAccount(data.signedMessageWithDetails)
      return res.status(200).send({
        success: true,
        message: 'OK',
      })
    }
  },
})
