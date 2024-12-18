import { handlerWrapper } from '@/server/common'
import { z } from 'zod'

export default handlerWrapper({
  inputSchema: z.object({
    error: z.unknown(),
  }),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'logger',
  handler: async (data, _, res) => {
    console.error('Error logged from logger: ', data.error)
    res.json({ success: true, message: 'OK' })
  },
})
