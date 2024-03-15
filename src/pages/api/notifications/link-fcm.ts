import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  createLinkingMessageForFcm,
  createUnlinkingMessageForFcm,
} from '@/server/notifications'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  address: z.string(),
  parentProxyAddress: z.string().optional(),
  fcmToken: z.string(),
  action: z.union([z.literal('link'), z.literal('unlink')], {
    invalid_type_error: 'Invalid action',
  }),
})
export type ApiFcmNotificationsLinkMessageBody = z.infer<typeof bodySchema>

type ResponseData = {
  data: string
}
export type ApiFcmNotificationsLinkMessageResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  errorLabel: 'link-fcm',
  handler: async (data, _, res) => {
    const createMessageForFcm =
      data.action === 'link'
        ? createLinkingMessageForFcm
        : createUnlinkingMessageForFcm

    const message = await createMessageForFcm({
      fcmToken: data.fcmToken,
      substrateAddress: data.address,
      proxySubstrateAddress: data.parentProxyAddress,
    })

    return res.status(200).send({
      success: true,
      message: 'OK',
      data: message,
    })
  },
})
