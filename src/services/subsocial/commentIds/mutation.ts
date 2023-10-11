import { getMaxMessageLength } from '@/constants/chat'
import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useSaveFile } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import datahubMutation from '@/services/subsocial/datahub/posts/mutation'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { getDatahubConfig } from '@/utils/env/client'
import { IpfsWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { KeyringPair } from '@polkadot/keyring/types'
import { PostContent } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useWalletGetter } from '../hooks'
import { createMutationWrapper } from '../utils'
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
        console.log('waiting energy...')
        await waitHasEnergy()

        if (data.messageIdToEdit) {
          await datahubMutation.updatePostData({
            ...getWallet(),
            cid,
            content,
            postId: data.messageIdToEdit,
          })
          return {
            tx: substrateApi.tx.posts.updatePost(data.messageIdToEdit, {
              content: IpfsWrapper(cid),
            }),
            summary: 'Updating message',
          }
        } else {
          await datahubMutation.createPostData({
            ...getWallet(),
            content: content,
            cid: cid,
            rootPostId: data.chatId,
            spaceId: data.hubId,
          })
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
      useHttp: true,
      // to make the error invisible to user if the tx was created (in this case, post was sent to dh)
      supressSendingTxError: !!getDatahubConfig(),
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
          } else if (!data.messageIdToEdit) {
            addOptimisticData({
              address,
              params: data,
              ipfsContent: content,
              client,
            })
          }
        },
        onSend: allowWindowUnload,
        onError: ({ data, context, address }, error, isAfterTxGenerated) => {
          allowWindowUnload()
          const content = context.content
          const optimisticId = content.optimisticId
          const messageIdToEdit = data.messageIdToEdit
          const isCreating = !messageIdToEdit && optimisticId
          const isUpdating = messageIdToEdit

          if (!isAfterTxGenerated || !getDatahubConfig()) {
            if (isCreating) {
              deleteOptimisticData({
                chatId: data.chatId,
                optimisticId,
                client,
              })
            } else if (isUpdating) {
              getPostQuery.invalidate(client, data.messageIdToEdit)
            }
          } else {
            if (isCreating) {
              datahubMutation.notifyCreatePostFailedOrRetryStatus({
                address,
                optimisticId,
                timestamp: Date.now().toString(),
                signer: getWallet().signer,
                reason: error,
              })
            } else if (isUpdating) {
              datahubMutation.notifyUpdatePostFailedOrRetryStatus({
                postId: messageIdToEdit,
                address,
                timestamp: Date.now().toString(),
                signer: getWallet().signer,
                reason: error,
              })
            }
          }
        },
      },
    }
  )
}

type ResendFailedMessageParams = {
  chatId: string
  content: PostContent
}
export function useResendFailedMessage(
  config?: MutationConfig<ResendFailedMessageParams>
) {
  const getWallet = useWalletGetter()

  const { mutateAsync: saveFile } = useSaveFile()
  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<ResendFailedMessageParams>(
    {
      getWallet,
      generateContext: undefined,
      transactionGenerator: async ({ apis: { substrateApi }, data }) => {
        const content = {
          body: data.content.body,
          inReplyTo: data.content.inReplyTo,
          extensions: data.content.extensions,
          optimisticId: data.content.optimisticId,
        } as PostContent & { optimisticId: string }

        const res = await saveFile(content)
        const cid = res.cid
        if (!cid) throw new Error('Failed to save file')

        await waitHasEnergy()

        return {
          tx: substrateApi.tx.posts.createPost(
            null,
            { Comment: { parentId: null, rootPostId: data.chatId } },
            IpfsWrapper(cid)
          ),
          summary: 'Retrying sending message',
        }
      },
    },
    config,
    {
      useHttp: true,
      txCallbacks: {
        onStart: () => preventWindowUnload(),
        onSend: ({ address, data }) => {
          allowWindowUnload()

          const signer = getWallet().signer
          notifyRetryStatus(address, data.content, signer, true)
        },
        onError: ({ data, address }, error, isAfterTxGenerated) => {
          allowWindowUnload()
          const signer = getWallet().signer

          if (isAfterTxGenerated)
            notifyRetryStatus(address, data.content, signer, false, error)
        },
      },
    }
  )
}
function notifyRetryStatus(
  address: string,
  content: PostContent,
  signer: KeyringPair | null,
  success: boolean,
  reason?: string
) {
  if (!signer || !content.optimisticId) return

  datahubMutation.notifyCreatePostFailedOrRetryStatus({
    address,
    optimisticId: content.optimisticId,
    timestamp: Date.now().toString(),
    signer,
    reason,
    isRetrying: { success },
  })
}

export const ResendFailedMessageWrapper = createMutationWrapper(
  useResendFailedMessage,
  'resend failed message'
)
