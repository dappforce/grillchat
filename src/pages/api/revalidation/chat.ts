import { handlerWrapper } from '@/server/common'
import { z } from 'zod'

const bodySchema = z
  .object({
    chatId: z.string(),
    hubId: z.string().optional(),
  })
  .or(z.object({ pathname: z.string() }))
export type RevalidateChatInput = z.infer<typeof bodySchema>

const handler = handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req) => req.body,
})({
  errorLabel: 'revalidation-chat',
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    try {
      res.revalidate('/')
      // if ('pathname' in data) {
      //   await res.revalidate(data.pathname)
      // } else {
      //   const [chat] = await getPostsServer([data.chatId])
      //   if (!chat) throw new Error('Chat not found')

      //   const originalHubId = chat.struct.spaceId
      //   const originalLink = getChatPageLink(
      //     { query: {} },
      //     createSlug(data.chatId, chat.content),
      //     originalHubId
      //   )

      //   const isInHomePage =
      //     env.NEXT_PUBLIC_MAIN_SPACE_ID === data.hubId ||
      //     constantsConfig.linkedChatsForHubId[
      //       env.NEXT_PUBLIC_MAIN_SPACE_ID
      //     ]?.includes(data.chatId)

      //   if (data.hubId && originalHubId !== data.hubId) {
      //     const currentLink = getChatPageLink(
      //       { query: {} },
      //       createSlug(data.chatId, chat.content),
      //       data.hubId
      //     )
      //     const promises = [
      //       res.revalidate(currentLink),
      //       res.revalidate(originalLink),
      //     ]
      //     if (isInHomePage) {
      //       promises.push(res.revalidate('/'))
      //     }
      //     await Promise.all(promises)
      //   } else {
      //     const promises = [res.revalidate(originalLink)]
      //     if (isInHomePage) {
      //       promises.push(res.revalidate('/'))
      //     }
      //     await Promise.all(promises)
      //   }
      // }

      res.json({ success: true, message: 'revalidated' })
    } catch (err) {
      return res.status(500).send({
        message: (err as any).message || 'Error revalidating chat',
        success: false,
      })
    }
  },
})
export default handler
