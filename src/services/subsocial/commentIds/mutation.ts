import { getMaxMessageLength } from '@/constants/chat'
import { useRevalidateChatPage, useSaveFile } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import datahubMutation from '@/services/datahub/posts/mutation'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { MutationConfig } from '@/subsocial-query'
import { useTransactionMutation } from '@/subsocial-query/subsocial/mutation'
import { ParentPostIdWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../hooks'
import { addOptimisticData, deleteOptimisticData } from './optimistic'
import { SendMessageParams } from './types'

async function generateMessageContent(
  params: SendMessageParams,
  client: QueryClient
): Promise<{
  content: PostContent
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

    return { content: savedContent }
  }

  const content = {
    body: params.message,
    inReplyTo: ReplyWrapper(params.replyTo),
    extensions: params.extensions,
    optimisticId: crypto.randomUUID(),
  } as PostContent

  return { content }
}
export function useSendMessage(config?: MutationConfig<SendMessageParams>) {
  const client = useQueryClient()

  const { mutateAsync: saveFile } = useSaveFile()
  const { mutate: revalidateChatPage } = useRevalidateChatPage()

  return useTransactionMutation<
    SendMessageParams,
    Awaited<ReturnType<typeof generateMessageContent>>
  >(
    {
      getWallet: getCurrentWallet,
      generateContext: (data) => generateMessageContent(data, client),
      transactionGenerator: async ({ data, context: { content } }) => {
        const maxLength = getMaxMessageLength(data.chatId)
        if (data.message && data.message.length > maxLength)
          throw new Error(
            'Your message is too long, please split it up to multiple messages'
          )

        const res = await saveFile(content)
        const cid = res.cid
        if (!cid) throw new Error('Failed to save file')

        if (data.messageIdToEdit) {
          await datahubMutation.updatePostData({
            ...getCurrentWallet(),
            args: {
              postId: data.messageIdToEdit,
              changes: {
                content: {
                  cid,
                  content,
                },
              },
            },
          })
          revalidateChatPage({ chatId: data.chatId, hubId: data.hubId })
        } else {
          await datahubMutation.createPostData({
            ...getCurrentWallet(),
            args: {
              content: content,
              cid: cid,
              rootPostId: data.chatId,
              parentPostId: ParentPostIdWrapper(data.replyTo),
              spaceId: data.hubId,
            },
          })
          revalidateChatPage({ chatId: data.chatId, hubId: data.hubId })
        }
      },
    },
    config,
    {
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
                struct: {
                  ...old.struct,
                  isUpdated: true,
                },
              }
            })
          } else {
            addOptimisticData({
              address,
              params: data,
              ipfsContent: content,
              client,
            })
          }
        },
        onSuccess: () => allowWindowUnload(),
        onError: ({ data, context }, error, isAfterTxGenerated) => {
          allowWindowUnload()
          const content = context.content
          const optimisticId = content.optimisticId
          const messageIdToEdit = data.messageIdToEdit
          const isCreating = !messageIdToEdit && optimisticId
          const isUpdating = messageIdToEdit

          if (!isAfterTxGenerated || !isDatahubAvailable) {
            if (isCreating) {
              deleteOptimisticData({
                chatId: data.chatId,
                idToDelete: optimisticId,
                client,
              })
            } else if (isUpdating) {
              getPostQuery.invalidate(client, data.messageIdToEdit)
            }
          } else {
            if (isCreating) {
              datahubMutation.notifyCreatePostFailedOrRetryStatus({
                ...getCurrentWallet(),
                args: {
                  optimisticId,
                  reason: error,
                },
                timestamp: Date.now(),
              })
            } else if (isUpdating) {
              datahubMutation.notifyUpdatePostFailedOrRetryStatus({
                ...getCurrentWallet(),
                args: {
                  postId: messageIdToEdit,
                  reason: error,
                },
                timestamp: Date.now(),
              })
            }
          }
        },
      },
    }
  )
}
