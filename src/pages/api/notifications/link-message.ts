import { ApiResponse, handlerWrapper } from '@/server/common'
import { getLinkingMessageForTelegramAccount } from '@/server/notifications'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  address: z.string(),
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
  handler: async (data, _, res) => {
    const message = await getLinkingMessageForTelegramAccount(data.address)
    return res.status(200).send({
      success: true,
      message: 'OK',
      data: message,
    })
  },
})
