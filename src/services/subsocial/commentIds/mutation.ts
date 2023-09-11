import { getMaxMessageLength } from '@/constants/chat'
import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutation'
import { createPostData } from '@/services/datahub/posts/mutation'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { PostContent } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
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

  return useSubsocialMutation<SendMessageParams, string>(
    getWallet,
    async (params, { substrateApi }, { address }) => {
      const maxLength = getMaxMessageLength(params.chatId)
      if (params.message && params.message.length > maxLength)
        throw new Error(
          'Your message is too long, please split it up to multiple messages'
        )

      console.log('waiting energy...')
      await waitHasEnergy()
      const content = generateMessageContent(params)
      const { cid, success } = await saveFile(content)

      if (!success || !cid) throw new Error('Failed to save file to IPFS')

      // make it a mutation and have it not needing to await this
      await createPostData({
        address,
        content,
        contentCid: cid,
        rootPostId: params.chatId,
        spaceId: params.hubId,
      })

      return {
        tx: substrateApi.tx.posts.createPost(
          null,
          { Comment: { parentId: null, rootPostId: params.chatId } },
          IpfsWrapper(cid)
        ),
        summary: 'Sending message',
      }
    },
    config
    // {
    //   txCallbacks: {
    //     // Removal of optimistic message generated is done by the subscription of messageIds
    //     // this is done to prevent a bit of flickering because the optimistic message is done first, before the message data finished fetching
    //     getContext: ({ data: params, address }) => {
    //       return generateOptimisticId<OptimisticMessageIdData>({
    //         address,
    //         messageData: generateMessageContent(params),
    //       })
    //     },
    //     onStart: ({ address, data: params }, tempId) => {
    //       preventWindowUnload()
    //       addOptimisticData({ address, params, tempId, client })
    //     },
    //     onSend: allowWindowUnload,
    //     onError: ({ address, data: params }, tempId) => {
    //       allowWindowUnload()
    //       deleteOptimisticData({ tempId, address, client, params })
    //     },
    //   },
    // }
  )
}
