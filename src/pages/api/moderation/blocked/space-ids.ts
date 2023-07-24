import { ApiResponse, handlerWrapper } from '@/server/common'
import { getBlockedInSpaceIds } from '@/server/moderation'
import { z } from 'zod'

const paramsSchema = z.object({
  spaceIds: z.array(z.string()).or(z.string()),
})
export type ApiModerationBlockedInSpaceIdsParams = z.infer<typeof paramsSchema>

type ResponseData = {
  data: Awaited<ReturnType<typeof getBlockedInSpaceIds>>
}
export type ApiModerationBlockedInSpaceIdsResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: paramsSchema,
  dataGetter: (req) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const spaceIds = Array.isArray(data.spaceIds)
      ? data.spaceIds
      : [data.spaceIds]
    const response = await getBlockedInSpaceIds(spaceIds)
    res.json({ data: response, success: true, message: 'OK' })
  },
})
