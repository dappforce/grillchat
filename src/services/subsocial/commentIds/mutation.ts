import { getMaxMessageLength } from '@/constants/chat'
import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import {
  createPostData,
  updatePostData,
} from '@/services/datahub/posts/mutation'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { getCID, IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { SendMessageParams } from './types'

async function generateMessageContent(
  params: SendMessageParams,
  client: QueryClient
): Promise<{
  cid: string
  content: PostContent | (PostContent & { optimisticId: string })
}> {
  if (params.messageIdToEdit) {
    const originalPost = await getPostQuery.fetchQuery(
      client,
      params.messageIdToEdit
    )
    const content = originalPost?.content
    const savedContent = {
      body: params.message,
      inReplyTo: ReplyWrapper(content?.inReplyTo?.id),
      extensions: content?.extensions,
    } as PostContent
    const cid = getCID(savedContent)

    return { content: savedContent, cid: cid?.toString() ?? '' }
  }

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
      generateContext: (data) => generateMessageContent(data, client),
      transactionGenerator: async ({
        apis: { substrateApi },
        data,
        context: { content },
      }) => {
        const maxLength = getMaxMessageLength(data.chatId)
        if (data.message && data.message.length > maxLength)
          throw new Error(
            'Your message is too long, please split it up to multiple messages'
          )

        const res = await saveFile(content)
        const cid = res.cid
        if (!cid) throw new Error('Failed to save file')
        await waitHasEnergy()

        if (data.messageIdToEdit) {
          return {
            tx: substrateApi.tx.posts.updatePost(data.messageIdToEdit, {
              content: IpfsWrapper(cid),
            }),
            summary: 'Updating message',
          }
        } else {
          return {
            tx: substrateApi.tx.posts.createPost(
              null,
              { Comment: { parentId: null, rootPostId: data.chatId } },
              IpfsWrapper(cid)
            ),
            summary: 'Sending message',
          }
        }
      },
    },
    config,
    {
      retry: 2,
      useHttp: true,
      txCallbacks: {
        onStart: ({ address, context, data }) => {
          preventWindowUnload()
          const content = context.content
          if (data.messageIdToEdit) {
            getPostQuery.setQueryData(client, data.messageIdToEdit, (old) => {
              if (!old) return old
              return {
                ...old,
                content: old.content
                  ? {
                      ...old.content,
                      body: data.message ?? '',
                      extensions: data.extensions,
                    }
                  : null,
              }
            })
          } else if (!data.messageIdToEdit && 'optimisticId' in content) {
            addOptimisticData({
              address,
              params: data,
              ipfsContent: content,
              client,
            })
          }
        },
        onBeforeSend: ({ data, context: { cid, content }, address }, txSig) => {
          if (!data.messageIdToEdit) {
            createPostData({
              address,
              content: content,
              contentCid: cid,
              rootPostId: data.chatId,
              spaceId: data.hubId,
              txSig,
            })
          } else {
            updatePostData({
              address,
              content: content,
              contentCid: cid,
              postId: data.messageIdToEdit,
              txSig,
            })
          }
        },
        onSend: allowWindowUnload,
        onError: ({ data, context }) => {
          allowWindowUnload()
          const content = context.content
          if (!data.messageIdToEdit && 'optimisticId' in content) {
            deleteOptimisticData({
              client,
              chatId: data.chatId,
              optimisticId: content.optimisticId,
            })
          } else if (data.messageIdToEdit) {
            getPostQuery.invalidate(client, data.messageIdToEdit)
          }
        },
      },
    }
  )
}
