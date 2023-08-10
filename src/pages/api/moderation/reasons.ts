import { ApiResponse, handlerWrapper } from '@/server/common'
import { getModerationReasons } from '@/server/moderation'

type ResponseData = {
  data: Awaited<ReturnType<typeof getModerationReasons>>
}
export type ApiModerationReasonsResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: null,
  dataGetter: (req) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (_data, _req, res) => {
    const reasons = await getModerationReasons()
    res.json({ data: reasons, message: 'OK', success: true })
  },
})
