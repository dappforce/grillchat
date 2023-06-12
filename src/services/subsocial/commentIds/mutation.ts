import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutations'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { generateOptimisticId } from '../utils'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { OptimisticMessageIdData, SendMessageParams } from './types'

export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const { mutateAsync: saveFile } = useSaveFile()
  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<SendMessageParams, string>(
    getWallet,
    async (params, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()
      const { cid, success } = await saveFile({
        body: params.message,
        inReplyTo: ReplyWrapper(params.replyTo),
        extensions: params.extensions,
      } as PostContent)

      if (!success) throw new Error('Failed to save file to IPFS')

      return {
        tx: substrateApi.tx.posts.createPost(
          null,
          { Comment: { parentId: null, rootPostId: params.chatId } },
          IpfsWrapper(cid)
        ),
        summary: 'Sending message',
      }
    },
    config,
    {
      txCallbacks: {
        // Removal of optimistic message generated is done by the subscription of messageIds
        // this is done to prevent a bit of flickering because the optimistic message is done first, before the message data finished fetching
        getContext: ({ data: params, address }) =>
          generateOptimisticId<OptimisticMessageIdData>({
            address,
            message: params.message,
          }),
        onStart: ({ address, data: params }, tempId) => {
          preventWindowUnload()
          addOptimisticData({ address, params, tempId, client })
        },
        onSend: allowWindowUnload,
        onError: ({ address, data: params }, tempId) => {
          allowWindowUnload()
          deleteOptimisticData({ tempId, address, client, params })
        },
      },
    }
  )
}
