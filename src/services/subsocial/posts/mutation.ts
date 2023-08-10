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
    getWallet,
    async ({ chatId }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      return {
        tx: substrateApi.tx.postFollows.followPost(chatId),
        summary: 'Joining chat',
      }
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
    getWallet,
    async ({ chatId }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      return {
        tx: substrateApi.tx.postFollows.unfollowPost(chatId),
        summary: 'Leaving chat',
      }
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
  config?: SubsocialMutationConfig<UpsertPostParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<UpsertPostParams>(
    getWallet,
    async (params, { substrateApi }) => {
      const { image, title, body } = params
      console.log('waiting energy...')
      await waitHasEnergy()

      const { success, cid } = await saveFile({
        title,
        body,
        image,
      })
      if (!success || !cid) throw new Error('Failed to save file')

      const { payload, action } = checkAction(params)
      if (action === 'update') {
        return {
          tx: substrateApi.tx.posts.updatePost(payload.postId, {
            content: IpfsWrapper(cid),
          }),
          summary: 'Updating post',
        }
      } else if (action === 'create') {
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
    config,
    {
      txCallbacks: {
        onSend: ({ data }) => {
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
        onError: async ({ data }) => {
          const { payload, action } = checkAction(data)
          if (action === 'update') {
            getPostQuery.invalidate(client, payload.postId)
          }
        },
        onSuccess: async ({ data, address }, _, txResult) => {
          const { payload, action } = checkAction(data)
          if (action === 'create') {
            getPostIdsBySpaceIdQuery.invalidate(client, payload.spaceId)
            const newId = await getNewIdFromTxResult(txResult)
            getOwnedPostIdsQuery.setQueryData(client, address, (ids) => {
              if (!ids) return ids
              return [...ids, newId]
            })
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
  config?: SubsocialMutationConfig<HideUnhidePostParams>
) {
  const client = useQueryClient()
  const getWallet = useWalletGetter()

  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation<HideUnhidePostParams>(
    getWallet,
    async ({ action, postId }, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()

      return {
        tx: substrateApi.tx.posts.updatePost(postId, {
          hidden: action === 'hide',
        }),
        summary: 'Hide/Unhide chat',
      }
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
    getWallet,
    async (params, { substrateApi }) => {
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
                    extensions: newContent.extensions,
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
  else unpinMessage(pinExtension, messageId)

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
function unpinMessage(pinExtension: PinsExtension, messageId: string) {
  if (!pinExtension) throw new Error('Message is not pinned')

  const index = (pinExtension.properties.ids as string[]).indexOf(messageId)
  if (index === -1) throw new Error('Message is not pinned')
  pinExtension.properties.ids = []
}
