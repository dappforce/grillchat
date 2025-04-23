import { saveFile } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import datahubMutation from '@/services/datahub/posts/mutation'
import {
  getOwnedPostsQuery,
  getPostsBySpaceIdQuery,
} from '@/services/datahub/posts/query'
import { getMyMainAddress } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PinsExtension, PostContent } from '@subsocial/api/types'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../hooks'
import { createMutationWrapper } from '../utils/mutation'

type Content = {
  image: string
  title: string
  body?: string
}
export type UpsertPostParams = (
  | { postId: string }
  | { spaceId: string; timestamp: number; uuid: string }
) &
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
  } as PostContent & { optimisticId: string; isChat?: boolean }

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
function useUpsertPostRaw(config?: MutationConfig<UpsertPostParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: UpsertPostParams) => {
      const { payload, action } = checkAction(params)
      const { content } = await generateMessageContent(params, client)

      if (action === 'update') {
        await datahubMutation.updatePostData({
          ...getCurrentWallet(),
          args: {
            postId: payload.postId,
            changes: {
              content: {
                cid: '',
                content: {
                  ...content,
                  tagsOriginal: content.tags.join(',') ?? '',
                } as PostContent,
              },
            },
          },
        })
      } else if (action === 'create') {
        await datahubMutation.createPostData({
          ...getCurrentWallet(),
          uuid: payload.uuid,
          timestamp: payload.timestamp,
          args: {
            content: {
              ...content,
              tagsOriginal: content.tags?.join(',') ?? '',
            } as PostContent,
            cid: '',
            spaceId: payload.spaceId,
          },
        })
      } else {
        throw new Error('Invalid action')
      }
    },
    onMutate: (params) => {
      config?.onMutate?.(params)
      const { payload, action } = checkAction(params)
      if (action === 'update') {
        getPostQuery.setQueryData(client, payload.postId, (post) => {
          if (!post) return post
          return {
            ...post,
            content: {
              ...post.content,
              title: payload.title,
              image: payload.image,
              body: payload.body ?? '',
            } as PostContent,
          }
        })
      }
    },
    onError: async (_, params, __) => {
      config?.onError?.(_, params, __)
      const { action, payload } = checkAction(params)
      if (!params) return
      if (action === 'update') {
        getPostQuery.invalidate(client, payload.postId)
      }
    },
    onSuccess: async (_, params, __) => {
      config?.onSuccess?.(_, params, __)
      const { payload, action } = checkAction(params)
      const mainAddress = getMyMainAddress() ?? ''
      if (action === 'create') {
        getPostsBySpaceIdQuery.invalidate(client, payload.spaceId)
        getOwnedPostsQuery.invalidate(client, mainAddress)
      } else if (action === 'update') {
        getPostQuery.invalidate(client, payload.postId)
      }
    },
  })
}
export const useUpsertPost = createMutationWrapper(
  useUpsertPostRaw,
  'Failed to upsert post'
)

export type HideUnhidePostParams = { postId: string; action: 'hide' | 'unhide' }
function useHideUnhidePostRaw(config?: MutationConfig<HideUnhidePostParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async ({ action, postId }: HideUnhidePostParams) => {
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
    onMutate: (data) => {
      config?.onMutate?.(data)
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
    onError: (_, data, __) => {
      config?.onError?.(_, data, __)
      getPostQuery.invalidate(client, data.postId)
    },
    onSuccess: (_, data, __) => {
      config?.onSuccess?.(_, data, __)
      getPostQuery.invalidate(client, data.postId)
    },
  })
}
export const useHideUnhidePost = createMutationWrapper(
  useHideUnhidePostRaw,
  'Failed to hide/unhide post'
)

export type HideMessageParams = {
  messageId: string
}
export function useHideMessage(config?: MutationConfig<HideMessageParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async ({ messageId }: HideMessageParams) => {
      await datahubMutation.updatePostData({
        ...getCurrentWallet(),
        args: { postId: messageId, changes: { hidden: true } },
      })
    },
    onMutate: async ({ messageId }) => {
      preventWindowUnload()

      getPostQuery.setQueryData(client, messageId, (message) => {
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
    onError: async (_, { messageId }) => {
      allowWindowUnload()
      getPostQuery.invalidate(client, messageId)
    },
    onSuccess: async (_, { messageId }) => {
      allowWindowUnload()
      getPostQuery.invalidate(client, messageId)
    },
  })
}

export type PinMessageParams = {
  chatId: string
  messageId: string
  action: 'pin' | 'unpin'
}
export function usePinMessage(config?: MutationConfig<PinMessageParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: PinMessageParams) => {
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
    onMutate: async (data) => {
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
    onError: async (_, data) => {
      allowWindowUnload()
      getPostQuery.invalidate(client, data.chatId)
    },
    onSuccess: async (_, data) => {
      allowWindowUnload()
      getPostQuery.invalidate(client, data.chatId)
    },
  })
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
