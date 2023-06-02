import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { ChatMessage, ChatMessageContent } from '@/optimism/types'
import { useWsChat } from '@/optimism/WsChatProvider'
import { useSaveFile } from '@/services/api/mutations'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { CommentContentForIpfs, CommentExtension } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { generateOptimisticId } from '../utils'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { OptimisticMessageIdData, SendMessageParams } from './types'

/** New UUID v4 without dashes. */
function newUuid() {
  return crypto.randomUUID().replaceAll('-', '')
}

export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)
  const wsChat = useWsChat()

  const { mutateAsync: saveFile } = useSaveFile()

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<SendMessageParams, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()

      const uuid = newUuid()
      const body = params.message
      const inReplyTo = ReplyWrapper(params.replyTo)

      const commentContent: CommentContentForIpfs = { uuid, body, inReplyTo }
      const { cid, success } = await saveFile(commentContent)

      if (!success || !cid) throw new Error('Failed to save file to IPFS')

      const roomId = params.rootPostId
      const commentExt: CommentExtension = { rootPostId: roomId }

      // TODO it should be possible to reply only to finalized posts

      const content: ChatMessageContent = { uuid, body, inReplyTo }
      const contentId = cid
      const chatMessage: ChatMessage = { roomId, content, contentId }

      // Send a new comment to optimistic chat server:
      wsChat.sendAddMessageRequest(chatMessage)

      return {
        tx: substrateApi.tx.posts.createPost(
          null,
          { Comment: commentExt },
          IpfsWrapper(cid)
        ),
        summary: 'Sending message',
      }
    },
    config,
    {
      txCallbacks: {
        // Removal of optimistic comment generated is done by the subscription of commentIds
        // this is done to prevent a bit of flickering because the optimistic comment is done first, before the comment data finished fetching
        getContext: ({ param, address }) =>
          generateOptimisticId<OptimisticMessageIdData>({
            address,
            message: param.message,
          }),
        onStart: ({ address, param }, tempId) => {
          preventWindowUnload()
          addOptimisticData({ address, param, tempId, client })
        },
        onSend: ({ address, param }, tempId) => {
          allowWindowUnload()
          // TODO we need to send an optimistic comment to backend here
        },
        onError: ({ address, param }, tempId) => {
          allowWindowUnload()
          deleteOptimisticData({ tempId, address, client, param })
        },
      },
    }
  )
}
