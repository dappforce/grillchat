import { ApiResponse, handlerWrapper } from '@/server/common'
import { getTelegramAccountsLinked } from '@/server/notifications'
import { GetTelegramAccountsLinkedQuery } from '@/server/notifications/generated'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const paramSchema = z.object({
  address: z.string(),
})
export type ApiNotificationsLinkedTelegramParam = z.infer<typeof paramSchema>

type ResponseData = {
  accounts: GetTelegramAccountsLinkedQuery['telegramAccountsLinkedToSubstrateAccount']['telegramAccounts']
}
export type ApiNotificationsLinkedTelegramResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: paramSchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  errorLabel: 'linked-telegram',
  handler: async (data, _, res) => {
    const linkedAccounts = await getTelegramAccountsLinked(data.address)
    return res.status(200).send({
      success: true,
      message: 'OK',
      accounts: linkedAccounts,
    })
  },
})
