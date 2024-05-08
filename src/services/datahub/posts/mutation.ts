import { getMaxMessageLength } from '@/constants/chat'
import { ApiDatahubPostMutationBody } from '@/pages/api/datahub/post'
import { getPostQuery } from '@/services/api/query'
import { apiInstance } from '@/services/api/utils'
import {
  addOptimisticData,
  deleteOptimisticData,
} from '@/services/subsocial/commentIds/optimistic'
import { SendMessageParams } from '@/services/subsocial/commentIds/types'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { ParentPostIdWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { blake2AsHex, decodeAddress } from '@polkadot/util-crypto'
import { PostContent } from '@subsocial/api/types'
import {
  CreatePostCallParsedArgs,
  PostKind,
  UpdatePostCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  DatahubParams,
  createSignedSocialDataEvent,
  isDatahubAvailable,
} from '../utils'

type GetDeterministicIdInput = {
  uuid: string
  timestamp: string
  account: string
}

export function isValidUUIDv4(maybeUuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    maybeUuid
  )
}

export function getDeterministicId({
  uuid,
  timestamp,
  account,
}: GetDeterministicIdInput): string {
  if (!isValidUUIDv4(uuid))
    throw new Error('Not valid uuid has been provided. Must be UUID v4.')
  const pubKey = u8aToHex(decodeAddress(account), undefined, false)
  const u8aKey = stringToU8a(pubKey + timestamp + uuid.replace(/-/g, ''))
  return blake2AsHex(u8aKey, 128, null, true)
}

async function createPostData(
  params: DatahubParams<{
    rootPostId?: string
    parentPostId?: string
    spaceId: string
    cid?: string
    content: PostContent
  }>
) {
  const { args } = params
  const { content, spaceId, cid, rootPostId, parentPostId } = args
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    parentPostId,
    spaceId,
    ipfsSrc: cid,
  }

  const input = createSignedSocialDataEvent(
    socialCallName.create_post,
    params,
    eventArgs,
    content
  )

  await apiInstance.post<any, any, ApiDatahubPostMutationBody>(
    '/api/datahub/post',
    {
      action: 'create-post',
      payload: input as any,
    }
  )
}

async function updatePostData(
  params: DatahubParams<{
    postId: string
    changes: {
      content?: {
        cid: string
        content: PostContent
      }
      hidden?: boolean
    }
  }>
) {
  const { postId, changes } = params.args
  const { content, hidden } = changes
  const eventArgs: UpdatePostCallParsedArgs = {
    spaceId: null,
    hidden: hidden ?? null,
    postId,
    ipfsSrc: content?.cid ?? null,
  }
  const input = createSignedSocialDataEvent(
    socialCallName.update_post,
    params,
    eventArgs,
    content?.content
  )

  await apiInstance.post<any, any, ApiDatahubPostMutationBody>(
    '/api/datahub/post',
    {
      action: 'update-post',
      payload: input as any,
    }
  )
}

function datahubWrapper<T extends (...args: any[]) => Promise<any>>(func: T) {
  return (...args: Parameters<T>) => {
    if (!isDatahubAvailable) return
    return func(...args)
  }
}
const datahubMutation = {
  createPostData: datahubWrapper(createPostData),
  updatePostData: datahubWrapper(updatePostData),
}
export default datahubMutation

type Params = SendMessageParams & {
  uuid: string
  timestamp: number
}
export function useSendMessage(
  config?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (data) => {
      const content = {
        body: data.message,
        inReplyTo: ReplyWrapper(data.replyTo),
        extensions: data.extensions,
      } as PostContent

      const maxLength = getMaxMessageLength(data.chatId)
      if (data.message && data.message.length > maxLength)
        throw new Error(
          'Your message is too long, please split it up to multiple messages'
        )

      if (data.messageIdToEdit) {
        datahubMutation.updatePostData({
          ...getCurrentWallet(),
          uuid: data.uuid,
          timestamp: data.timestamp,
          isOffchain: true,
          args: {
            postId: data.messageIdToEdit,
            changes: {
              content: {
                cid: '',
                content,
              },
            },
          },
        })
      } else {
        await datahubMutation.createPostData({
          ...getCurrentWallet(),
          uuid: data.uuid,
          timestamp: data.timestamp,
          isOffchain: true,
          args: {
            parentPostId: ParentPostIdWrapper(data.replyTo),
            content: content,
            rootPostId: data.chatId,
            spaceId: data.hubId,
          },
        })
      }
    },
    onMutate: async (data) => {
      config?.onMutate?.(data)
      preventWindowUnload()
      const content = {
        body: data.message,
        inReplyTo: ReplyWrapper(data.replyTo),
        extensions: data.extensions,
      } as PostContent

      const newId = getDeterministicId({
        account:
          getCurrentWallet().proxyToAddress || getCurrentWallet().address,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      if (data.messageIdToEdit) {
        getPostQuery.setQueryData(client, data.messageIdToEdit, (oldData) => {
          if (!oldData) return null
          return {
            ...oldData,
            struct: {
              ...oldData.struct,
              isUpdated: true,
            },
            content,
          }
        })
      } else {
        addOptimisticData({
          address:
            getCurrentWallet().proxyToAddress || getCurrentWallet().address,
          params: data,
          ipfsContent: content,
          client,
          newId,
        })
      }
      config?.onMutate?.(data)
    },
    onError: (err, data, context) => {
      config?.onError?.(err, data, context)
      allowWindowUnload()
      const newId = getDeterministicId({
        account:
          getCurrentWallet().proxyToAddress || getCurrentWallet().address,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })
      const { chatId } = data
      deleteOptimisticData({
        chatId,
        client,
        idToDelete: newId,
      })
      config?.onError?.(err, data, context)
    },
    onSuccess: (...params) => {
      config?.onSuccess?.(...params)
      allowWindowUnload()
    },
  })
}
