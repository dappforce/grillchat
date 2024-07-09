import { handlerWrapper } from '@/server/common'
import { z } from 'zod'

export default handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.query,
})({
  errorLabel: 'healthcheck',
  allowedMethods: ['GET'],
  handler: async (_, __, res) => {
    res.json({ message: 'OK', success: true })
  },
})
