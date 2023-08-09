import { ApiResponse, handlerWrapper } from '@/server/common'
import { getBlockedResources } from '@/server/moderation'
import { z } from 'zod'

const paramsSchema = z.object({
  postIds: z.array(z.string()).or(z.string()).optional(),
  spaceIds: z.array(z.string()).or(z.string()).optional(),
})
export type ApiModerationBlockedInPostIdsParams = z.infer<typeof paramsSchema>

type ResponseData = {
  data: Awaited<ReturnType<typeof getBlockedResources>>
}
export type ApiModerationBlockedInPostIdsResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: paramsSchema,
  dataGetter: (req) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  errorLabel: 'blocked',
  handler: async (data, _, res) => {
    function handleArrayParam(param: string | string[] | undefined) {
      if (!param) return []
      return Array.isArray(param) ? param : [param]
    }

    const postIds = handleArrayParam(data.postIds)
    const spaceIds = handleArrayParam(data.spaceIds)

    const response = await getBlockedResources({ postIds, spaceIds })

    res.json({ data: response, success: true, message: 'OK' })
  },
})
