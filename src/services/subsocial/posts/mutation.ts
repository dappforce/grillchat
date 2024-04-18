import {
  invalidatePostServerCache,
  saveFile,
  useRevalidateChatPage,
} from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import { isPersistentId } from '@/services/datahub/posts/fetcher'
import datahubMutation from '@/services/datahub/posts/mutation'
import {
  getOwnedPostsQuery,
  getPostsBySpaceIdQuery,
} from '@/services/datahub/posts/query'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { useTransactionMutation } from '@/subsocial-query/subsocial/mutation'
import { TransactionMutationConfig } from '@/subsocial-query/subsocial/types'
import { getChatPageLink } from '@/utils/links'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PinsExtension, PostContent } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { getCurrentWallet } from '../hooks'
import { createMutationWrapper } from '../utils/mutation'

type Content = {
  image: string
  title: string
  body?: string
}
export type UpsertPostParams = ({ postId: string } | { spaceId: string }) &
  Content

async function generateMessageContent(
  params: UpsertPostParams,
  client: QueryClient
) {
  const { image, title, body } = params

  if ('postId' in params && params.postId) {
    const post = await getPostQuery.fetchQuery(client, params.postId)
    if (!post) throw new Error('Post not found')

    const content = post?.content
    const savedContent = {
      ...content,
      image,
      title,
      body,
    } as PostContent

    return { content: savedContent }
  }

  const content = {
    image,
    title,
    body,
    optimisticId: crypto.randomUUID(),
  } as PostContent & { optimisticId: string }

  return { content }
}
type GeneratedMessageContent = Awaited<
  ReturnType<typeof generateMessageContent>
>
function checkAction(data: UpsertPostParams) {
  if ('spaceId' in data && data.spaceId) {
    return { payload: data, action: 'create' } as const
  }
  if ('postId' in data && data.postId) {
    return { payload: data, action: 'update' } as const
  }

  return { payload: data, action: 'invalid' } as const
}
export function useUpsertPost(
  config?: TransactionMutationConfig<UpsertPostParams, GeneratedMessageContent>
) {
  const client = useQueryClient()

  const { mutate: revalidateChatPage } = useRevalidateChatPage()
  const router = useRouter()

  return useTransactionMutation<UpsertPostParams, GeneratedMessageContent>(
    {
      getWallet: getCurrentWallet,
      generateContext: (params) => generateMessageContent(params, client),
      transactionGenerator: async ({ data: params, context: { content } }) => {
        const { payload, action } = checkAction(params)

        const res = await saveFile(content)
        const cid = res.cid
        if (!cid) throw new Error('Failed to save file')

        if (action === 'update') {
          await datahubMutation.updatePostData({
            ...getCurrentWallet(),
            args: {
              postId: payload.postId,
              changes: {
                content: {
                  cid,
                  content,
                },
              },
            },
          })
          revalidateChatPage({ pathname: getChatPageLink(router) })
        } else if (action === 'create') {
          await datahubMutation.createPostData({
            ...getCurrentWallet(),
            args: {
              content,
              cid: cid,
              spaceId: payload.spaceId,
            },
          })
        }

        throw new Error('Invalid params')
      },
    },
    config,
    {
      // to make the error invisible to user if the tx was created (in this case, post was sent to dh)
      supressSendingTxError: isDatahubAvailable,
      txCallbacks: {
        onStart: ({ data }) => {
          if (isDatahubAvailable) return

          const { payload, action } = checkAction(data)
          if (action === 'update') {
            getPostQuery.setQueryData(client, payload.postId, (post) => {
              if (!post) return post
              return {
                ...post,
                content: {
                  ...post.content,
                  title: data.title,
                  image: data.image,
                  body: data.body ?? '',
                } as PostContent,
              }
            })
          }
        },
        onError: ({ data, context }, error, isAfterTxGenerated) => {
          const { action, payload } = checkAction(data)
          if (!isAfterTxGenerated) return

          if (action === 'create' && context.content.optimisticId) {
            datahubMutation.notifyCreatePostFailedOrRetryStatus({
              ...getCurrentWallet(),
              timestamp: Date.now(),
              args: {
                optimisticId: context.content.optimisticId,
                reason: error,
              },
            })
          } else if (action === 'update') {
            datahubMutation.notifyUpdatePostFailedOrRetryStatus({
              ...getCurrentWallet(),
              args: {
                postId: payload.postId,
                reason: error,
              },
              timestamp: Date.now(),
            })
          }
        },
        onSuccess: async ({ data, address }, txResult) => {
          const { payload, action } = checkAction(data)
          if (action === 'create') {
            getPostsBySpaceIdQuery.invalidate(client, payload.spaceId)
            getOwnedPostsQuery.invalidate(client, address)
          } else if ('postId' in data && data.postId) {
            await invalidatePostServerCache(data.postId)
            getPostQuery.invalidate(client, data.postId)
          }
        },
      },
    }
  )
}
export const UpsertPostWrapper = createMutationWrapper(
  useUpsertPost,
  'Failed to upsert post'
)

export type HideUnhidePostParams = { postId: string; action: 'hide' | 'unhide' }
export function useHideUnhidePost(
  config?: TransactionMutationConfig<HideUnhidePostParams>
) {
  const client = useQueryClient()

  return useTransactionMutation<HideUnhidePostParams>(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({ data: { action, postId } }) => {
        await datahubMutation.updatePostData({
          ...getCurrentWallet(),
          args: {
            postId,
            changes: {
              hidden: action === 'hide',
            },
          },
        })
      },
    },
    config,
    {
      txCallbacks: {
        onStart: ({ data }) => {
          getPostQuery.setQueryData(client, data.postId, (post) => {
            if (!post) return post
            return {
              ...post,
              struct: {
                ...post.struct,
                hidden: data.action === 'hide',
              },
            }
          })
        },
        onError: async ({ data }) => {
          getPostQuery.invalidate(client, data.postId)
        },
        onSuccess: async ({ data }) => {
          await invalidatePostServerCache(data.postId)
          getPostQuery.invalidate(client, data.postId)
        },
      },
    }
  )
}
export const HideUnhideChatWrapper = createMutationWrapper(
  useHideUnhidePost,
  'Failed to hide/unhide chat'
)

export type HideMessageParams = {
  messageId: string
}
export function useHideMessage(
  config?: TransactionMutationConfig<HideMessageParams>
) {
  const client = useQueryClient()

  return useTransactionMutation<HideMessageParams>(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({ data: params }) => {
        await datahubMutation.updatePostData({
          ...getCurrentWallet(),
          args: { postId: params.messageId, changes: { hidden: true } },
        })

        if (!isPersistentId(params.messageId)) {
          throw new Error(
            'Hiding offchain message, this error is expected to be supresssed'
          )
        }
      },
    },
    config,
    {
      supressSendingTxError: true,
      txCallbacks: {
        onStart: async ({ data }) => {
          preventWindowUnload()

          getPostQuery.setQueryData(client, data.messageId, (message) => {
            if (!message) return message
            return {
              ...message,
              struct: {
                ...message.struct,
                hidden: true,
              },
            }
          })
        },
        onError: async ({ data }) => {
          allowWindowUnload()
          getPostQuery.invalidate(client, data.messageId)
        },
        onSuccess: async ({ data }) => {
          allowWindowUnload()
          await invalidatePostServerCache(data.messageId)
          getPostQuery.invalidate(client, data.messageId)
        },
      },
    }
  )
}

export type PinMessageParams = {
  chatId: string
  messageId: string
  action: 'pin' | 'unpin'
}
export function usePinMessage(
  config?: TransactionMutationConfig<PinMessageParams>
) {
  const client = useQueryClient()

  return useTransactionMutation<PinMessageParams>(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({ data: params }) => {
        const newContent = await getUpdatedPinPostContent(client, params)
        const { success, cid } = await saveFile(newContent)
        if (!success || !cid) throw new Error('Failed to save file')

        await datahubMutation.updatePostData({
          ...getCurrentWallet(),
          args: {
            postId: params.chatId,
            changes: {
              content: {
                cid,
                content: newContent as PostContent,
              },
            },
          },
        })
      },
    },
    config,
    {
      txCallbacks: {
        onStart: async ({ data }) => {
          preventWindowUnload()

          const newContent = await getUpdatedPinPostContent(client, data)
          getPostQuery.setQueryData(client, data.chatId, (chat) => {
            if (!chat) return chat
            return {
              ...chat,
              content: chat.content
                ? {
                    ...chat.content,
                    ...newContent,
                  }
                : null,
            }
          })
        },
        onError: async ({ data }) => {
          allowWindowUnload()
          getPostQuery.invalidate(client, data.chatId)
        },
        onSuccess: async ({ data }) => {
          allowWindowUnload()
          await invalidatePostServerCache(data.chatId)
          getPostQuery.invalidate(client, data.chatId)
        },
      },
    }
  )
}

async function getUpdatedPinPostContent(
  client: QueryClient,
  { action, chatId, messageId }: PinMessageParams
) {
  const chat = await getPostQuery.fetchQuery(client, chatId)
  if (!chat?.content) throw new Error('Pin Chat not found')

  const content = chat.content
  const chatContent = {
    body: content.body,
    title: content.title,
    image: content.image,
    extensions: content.extensions,
  }

  const pinExtension = chatContent.extensions?.find(
    (ext) => ext.id === 'subsocial-pinned-posts'
  ) as PinsExtension

  if (action === 'pin') pinMessage(chatContent, pinExtension, messageId)
  else unpinMessage(pinExtension)

  return chatContent
}
function pinMessage(
  chatContent: Pick<PostContent, 'extensions'>,
  pinExtension: PinsExtension,
  messageId: string
) {
  if (!pinExtension) {
    if (!chatContent.extensions) chatContent.extensions = []
    chatContent.extensions.push({
      id: 'subsocial-pinned-posts',
      properties: { ids: [messageId] },
    })
  } else {
    pinExtension.properties.ids = [messageId]
  }
}
function unpinMessage(pinExtension: PinsExtension) {
  pinExtension.properties.ids = []
}
