import { ApiResponse, handlerWrapper } from '@/server/common'
import { getModeratorData } from '@/server/moderation'
import { z } from 'zod'

const querySchema = z.object({
  address: z.string(),
})
export type ApiModerationModeratorParams = z.infer<typeof querySchema>
type ResponseData = {
  ctxPostIds: string[] | null
}
export type ApiModerationActionsMessageResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req) => req.query,
})<ResponseData>({
  errorLabel: 'moderator',
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const moderatorData = await getModeratorData({ address: data.address })
    res.json({
      ctxPostIds: moderatorData,
      success: !!moderatorData,
      message: moderatorData ? 'OK' : 'Not Found',
    })
  },
})
