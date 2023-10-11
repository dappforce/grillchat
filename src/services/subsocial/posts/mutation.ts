import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { invalidatePostServerCache, saveFile } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { getNewIdFromTxResult } from '@/utils/blockchain'
import { IpfsWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PinsExtension, PostContent } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import datahubMutation from '../datahub/posts/mutation'
import { useWalletGetter } from '../hooks'
import { createMutationWrapper } from '../utils'
import {
  getFollowedPostIdsByAddressQuery,
  getOwnedPostIdsQuery,
  getPostIdsBySpaceIdQuery,
} from './query'

export type JoinChatParams = {
  chatId: string
}
export function useJoinChat(config?: SubsocialMutationConfig<JoinChatParams>) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams>(
    {
      getWallet,
      generateContext: undefined,
      transactionGenerator: async ({
        data: { chatId },
        apis: { substrateApi },
      }) => {
        console.log('waiting energy...')
        await waitHasEnergy()

        return {
          tx: substrateApi.tx.postFollows.followPost(chatId),
          summary: 'Joining chat',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSend: ({ address, data }) => {
          getFollowedPostIdsByAddressQuery.setQueryData(
            client,
            address,
            (ids) => [...(ids ?? []), data.chatId]
          )
        },
        onError: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
        onSuccess: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
      },
    }
  )
}
export const JoinChatWrapper = createMutationWrapper(
  useJoinChat,
  'Failed to join chat'
)

export type LeaveChatParams = {
  chatId: string
}
export function useLeaveChat(
  config?: SubsocialMutationConfig<LeaveChatParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<JoinChatParams>(
    {
      getWallet,
      generateContext: undefined,
      transactionGenerator: async ({
        data: { chatId },
        apis: { substrateApi },
      }) => {
        console.log('waiting energy...')
        await waitHasEnergy()

        return {
          tx: substrateApi.tx.postFollows.unfollowPost(chatId),
          summary: 'Leaving chat',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSend: ({ address, data }) => {
          getFollowedPostIdsByAddressQuery.setQueryData(
            client,
            address,
            (ids) => ids?.filter((id) => id !== data.chatId)
          )
        },
        onError: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
        onSuccess: ({ address }) => {
          getFollowedPostIdsByAddressQuery.invalidate(client, address)
        },
      },
    }
  )
}
export const LeaveChatWrapper = createMutationWrapper(
  useLeaveChat,
  'Failed to leave chat'
)

type Content = {
  image: string
  title: string
  body?: string
}
export type UpsertPostParams = ({ postId: string } | { spaceId: string }) &
  Content

async function generateMessageContent(params: Content) {
  const { image, title, body } = params
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
  config?: SubsocialMutationConfig<UpsertPostParams, GeneratedMessageContent>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<UpsertPostParams, GeneratedMessageContent>(
    {
      getWallet,
      generateContext: (params) => generateMessageContent(params),
      transactionGenerator: async ({
        data: params,
        apis: { substrateApi },
        context: { content },
      }) => {
        const { payload, action } = checkAction(params)

        console.log('waiting energy...')
        await waitHasEnergy()

        const res = await saveFile(content)
        const cid = res.cid
        if (!cid) throw new Error('Failed to save file')

        if (action === 'update') {
          await datahubMutation.updatePostData({
            ...getWallet(),
            cid,
            content,
            postId: payload.postId,
          })
          return {
            tx: substrateApi.tx.posts.updatePost(payload.postId, {
              content: IpfsWrapper(cid),
            }),
            summary: 'Updating post',
          }
        } else if (action === 'create') {
          await datahubMutation.createPostData({
            ...getWallet(),
            content,
            cid: cid,
            spaceId: payload.spaceId,
          })
          return {
            tx: substrateApi.tx.posts.createPost(
              payload.spaceId,
              { RegularPost: null },
              IpfsWrapper(cid)
            ),
            summary: 'Creating post',
          }
        }

        throw new Error('Invalid params')
      },
    },
    config,
    {
      // to make the error invisible to user if the tx was created (in this case, post was sent to dh)
      supressSendingTxError: true,
      txCallbacks: {
        onError: ({ data, address, context }, error, isAfterTxGenerated) => {
          const { action } = checkAction(data)
          if (!isAfterTxGenerated) return

          if (action === 'create') {
            datahubMutation.notifyCreatePostFailedOrRetryStatus({
              address,
              optimisticId: context.content.optimisticId,
              timestamp: Date.now().toString(),
              signer: getWallet().signer,
              reason: error,
            })
          } else {
            // TODO: notify update post failed
          }
        },
        onSuccess: async ({ data, address }, txResult) => {
          const { payload, action } = checkAction(data)
          if (action === 'create') {
            getPostIdsBySpaceIdQuery.invalidate(client, payload.spaceId)
            const newId = await getNewIdFromTxResult(txResult)
            getOwnedPostIdsQuery.setQueryData(client, address, (ids) => {
              if (!ids) return ids
              return [...ids, newId]
            })
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
  config?: SubsocialMutationConfig<HideUnhidePostParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<HideUnhidePostParams>(
    {
      getWallet,
      generateContext: undefined,
      transactionGenerator: async ({
        data: { action, postId },
        apis: { substrateApi },
      }) => {
        console.log('waiting energy...')
        await waitHasEnergy()

        return {
          tx: substrateApi.tx.posts.updatePost(postId, {
            hidden: action === 'hide',
          }),
          summary: 'Hide/Unhide chat',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSend: ({ data }) => {
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

export type PinMessageParams = {
  chatId: string
  messageId: string
  action: 'pin' | 'unpin'
}
export function usePinMessage(
  config?: SubsocialMutationConfig<PinMessageParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<PinMessageParams>(
    {
      getWallet,
      generateContext: undefined,
      transactionGenerator: async ({
        data: params,
        apis: { substrateApi },
      }) => {
        console.log('waiting energy...')
        await waitHasEnergy()

        const newContent = await getUpdatedPinPostContent(client, params)
        const { success, cid } = await saveFile(newContent)
        if (!success || !cid) throw new Error('Failed to save file')

        return {
          tx: substrateApi.tx.posts.updatePost(params.chatId, {
            content: IpfsWrapper(cid),
          }),
          summary: 'Pinning message',
        }
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
        onSend: () => allowWindowUnload(),
        onError: async ({ data }) => {
          allowWindowUnload()
          getPostQuery.invalidate(client, data.chatId)
        },
        onSuccess: async ({ data }) => {
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
    inReplyTo: content.inReplyTo,
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
