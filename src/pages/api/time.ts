import { ApiResponse, handlerWrapper } from '@/old/server/common'
import { z } from 'zod'

export type ApiTimeResponse = ApiResponse<{ time: number }>

export default handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.query,
})<ApiTimeResponse>({
  errorLabel: 'time',
  allowedMethods: ['GET'],
  handler: async (_, __, res) => {
    res.json({ success: true, message: 'OK', time: Date.now() })
  },
})
