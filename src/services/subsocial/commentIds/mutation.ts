import { getMaxMessageLength } from '@/constants/chat'
import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutation'
import { createPostData } from '@/services/datahub/posts/mutation'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { getCID, IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { SendMessageParams } from './types'

async function generateMessageContent(params: SendMessageParams) {
  const content = {
    body: params.message,
    inReplyTo: ReplyWrapper(params.replyTo),
    extensions: params.extensions,
    optimisticId: crypto.randomUUID(),
  } as PostContent & { optimisticId: string }

  const cid = await getCID(content)

  return { content, cid: cid?.toString() ?? '' }
}
export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const { mutateAsync: saveFile } = useSaveFile()
  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<
    SendMessageParams,
    Awaited<ReturnType<typeof generateMessageContent>>
  >(
    {
      getWallet,
      generateContext: (data) => generateMessageContent(data),
      transactionGenerator: async ({
        apis: { substrateApi },
        wallet: { address },
        data,
        context: { cid: prebuiltCid, content },
      }) => {
        const maxLength = getMaxMessageLength(data.chatId)
        if (data.message && data.message.length > maxLength)
          throw new Error(
            'Your message is too long, please split it up to multiple messages'
          )

        createPostData({
          address,
          content: content,
          contentCid: prebuiltCid,
          rootPostId: data.chatId,
          spaceId: data.hubId,
        })

        const { cid, success } = await saveFile(content)
        if (!success || !cid) throw new Error('Failed to save file to IPFS')

        await waitHasEnergy()

        return {
          tx: substrateApi.tx.posts.createPost(
            null,
            { Comment: { parentId: null, rootPostId: data.chatId } },
            IpfsWrapper(cid)
          ),
          summary: 'Sending message',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onStart: ({ address, context, data }) => {
          preventWindowUnload()
          addOptimisticData({
            address,
            params: data,
            ipfsContent: context.content,
            client,
          })
        },
        onSend: allowWindowUnload,
        onError: ({ data, context }) => {
          allowWindowUnload()
          deleteOptimisticData({
            client,
            chatId: data.chatId,
            optimisticId: context.content.optimisticId,
          })
        },
      },
    }
  )
}
