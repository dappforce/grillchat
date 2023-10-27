import { handlerWrapper } from '@/server/common'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { z } from 'zod'
import { getPostsServer } from '../posts'

const bodySchema = z
  .object({
    chatId: z.string(),
    hubId: z.string().optional(),
  })
  .or(z.object({ pathname: z.string() }))
export type RevalidateChatInput = z.infer<typeof bodySchema>

const handler = handlerWrapper({
  inputSchema: z.object({ chatId: z.string(), hubId: z.string().optional() }),
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    try {
      const [chat] = await getPostsServer([data.chatId])
      if (!chat) throw new Error('Chat not found')

      const originalHubId = chat.struct.spaceId
      const originalLink = getChatPageLink(
        { query: {} },
        createSlug(data.chatId, chat.content),
        originalHubId
      )

      if (originalHubId !== data.hubId) {
        const currentLink = getChatPageLink(
          { query: {} },
          createSlug(data.chatId, chat.content),
          data.hubId
        )
        await Promise.all([
          res.revalidate(currentLink),
          res.revalidate(originalLink),
        ])
      } else {
        await res.revalidate(originalLink)
      }

      res.json({ success: true, message: 'revalidated' })
    } catch (err) {
      return res.status(500).send({
        message: (err as any).message || 'Error revalidating chat',
        success: false,
      })
    }
  },
  errorLabel: 'Error revalidating post',
})
export default handler
