import { getMaxMessageLength } from '@/constants/chat'
import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutation'
import { createPostData } from '@/services/datahub/posts/mutation'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { SendMessageParams } from './types'

function generateMessageContent(params: SendMessageParams) {
  return {
    body: params.message,
    inReplyTo: ReplyWrapper(params.replyTo),
    extensions: params.extensions,
    optimisticId: crypto.randomUUID(),
  } as PostContent & { optimisticId: string }
}
export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const { mutateAsync: saveFile } = useSaveFile()
  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<
    SendMessageParams,
    ReturnType<typeof generateMessageContent>
  >(
    {
      getWallet,
      generateContext: (data) => generateMessageContent(data),
      transactionGenerator: async ({
        apis: { substrateApi },
        wallet: { address },
        data,
        context: ipfsContent,
      }) => {
        const maxLength = getMaxMessageLength(data.chatId)
        if (data.message && data.message.length > maxLength)
          throw new Error(
            'Your message is too long, please split it up to multiple messages'
          )

        const { cid, success } = await saveFile(ipfsContent)
        if (!success || !cid) throw new Error('Failed to save file to IPFS')

        createPostData({
          address,
          content: ipfsContent,
          contentCid: cid,
          rootPostId: data.chatId,
          spaceId: data.hubId,
        })

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
            ipfsContent: context,
            client,
          })
        },
        onSend: allowWindowUnload,
        onError: ({ data, context }) => {
          allowWindowUnload()
          deleteOptimisticData({
            client,
            chatId: data.chatId,
            optimisticId: context.optimisticId,
          })
        },
      },
    }
  )
}
