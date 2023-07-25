import { ApiResponse, handlerWrapper } from '@/server/common'
import { getBlockedInPostIdDetailed } from '@/server/moderation'
import { z } from 'zod'

const paramsSchema = z.object({
  postId: z.string(),
})
export type ApiModerationBlockedInPostIdsDetailedParams = z.infer<
  typeof paramsSchema
>

type ResponseData = {
  data: Awaited<ReturnType<typeof getBlockedInPostIdDetailed>>
}
export type ApiModerationBlockedInPostIdsDetailedResponse =
  ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: paramsSchema,
  dataGetter: (req) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  errorLabel: 'blocked-post-ids-detailed',
  handler: async (data, _, res) => {
    const response = await getBlockedInPostIdDetailed(data.postId)
    res.json({ data: response, success: true, message: 'OK' })
  },
})
