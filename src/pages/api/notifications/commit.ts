import { ApiResponse, handlerWrapper } from '@/server/common'
import { commitSignedMessageWithAction } from '@/server/notifications'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  signedMessageWithDetails: z.string(),
})
export type ApiCommitSignedMessageBody = z.infer<typeof bodySchema>

type ResponseData = {}
export type ApiCommitSignedMessageResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  errorLabel: 'commit-signed-message',
  handler: async (data, _, res) => {
    await commitSignedMessageWithAction(data.signedMessageWithDetails)
    return res.status(200).send({
      success: true,
      message: 'OK',
    })
  },
})
