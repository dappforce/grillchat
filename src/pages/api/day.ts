import { ApiResponse, handlerWrapper } from '@/server/common'
import { getDayAndWeekTimestamp } from '@/services/datahub/utils'
import { z } from 'zod'

export type ApiDayResponse = ApiResponse<{ day: number; week: number }>

export default handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.query,
})<ApiDayResponse>({
  errorLabel: 'day',
  allowedMethods: ['GET'],
  handler: async (_, __, res) => {
    const { day, week } = getDayAndWeekTimestamp()
    res.json({ success: true, message: 'OK', day, week })
  },
})
