import { handlerWrapper } from '@/server/common'
import { z } from 'zod'
import { getLinkMetadata } from '../posts'

const bodySchema = z.object({
  link: z.string(),
})
export type RevalidateLinkInput = z.infer<typeof bodySchema>

const handler = handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req) => req.body,
})<{ data: Awaited<ReturnType<typeof getLinkMetadata>> }>({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    try {
      const metadata = await getLinkMetadata(data.link, true)
      res.json({ success: true, message: 'revalidated', data: metadata })
    } catch (err) {
      return res.status(500).send({
        message: (err as any).message || 'Error revalidating link',
        success: false,
        data: null,
      })
    }
  },
  errorLabel: 'Error revalidating link',
})
export default handler
