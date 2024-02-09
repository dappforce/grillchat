import { getMaxMessageLength } from '@/constants/chat'
import { ApiDatahubPostMutationBody } from '@/pages/api/datahub/post'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import {
  addOptimisticData,
  deleteOptimisticData,
} from '@/services/subsocial/commentIds/optimistic'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { blake2AsHex, decodeAddress } from '@polkadot/util-crypto'
import { PostContent } from '@subsocial/api/types'
import {
  CreatePostCallParsedArgs,
  PostKind,
  SynthCreatePostTxFailedCallParsedArgs,
  SynthCreatePostTxRetryCallParsedArgs,
  SynthUpdatePostTxFailedCallParsedArgs,
  SynthUpdatePostTxRetryCallParsedArgs,
  UpdatePostCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import {
  DatahubParams,
  createSignedSocialDataEvent,
  isDatahubAvailable,
} from '../utils'

export function isValidUUIDv4(maybeUuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    maybeUuid
  )
}

type GetDeterministicIdInput = {
  uuid: string
  timestamp: string
  account: string
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
    spaceId: string
    cid?: string
    content: PostContent
  }>
) {
  const { args } = params
  const { content, spaceId, cid, rootPostId } = args
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    spaceId,
    ipfsSrc: cid,
  }

  const input = createSignedSocialDataEvent(
    socialCallName.create_post,
    params,
    eventArgs,
    content
  )

  await axios.post<any, any, ApiDatahubPostMutationBody>('/api/datahub/post', {
    action: 'create-post',
    payload: input as any,
  })
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

  await axios.post<any, any, ApiDatahubPostMutationBody>('/api/datahub/post', {
    action: 'update-post',
    payload: input as any,
  })
}

async function notifyCreatePostFailedOrRetryStatus(
  params: Omit<
    DatahubParams<{
      isRetrying?: {
        success: boolean
      }
      reason?: string
      optimisticId: string
    }> & { timestamp: number },
    'txSig'
  >
) {
  const { timestamp, args } = params
  const { isRetrying, ...otherArgs } = args
  const augmentedArgs = { ...otherArgs, timestamp: timestamp.toString() }
  let event:
    | {
        name: (typeof socialCallName)['synth_create_post_tx_failed']
        args: SynthCreatePostTxFailedCallParsedArgs
      }
    | {
        name: (typeof socialCallName)['synth_create_post_tx_retry']
        args: SynthCreatePostTxRetryCallParsedArgs
      } = {
    name: socialCallName.synth_create_post_tx_failed,
    args: augmentedArgs,
  }
  if (isRetrying) {
    event = {
      name: socialCallName.synth_create_post_tx_retry,
      args: {
        ...augmentedArgs,
        success: isRetrying.success,
      },
    }
  }

  const input = createSignedSocialDataEvent(event.name, params, event.args)

  await axios.post<any, any, ApiDatahubPostMutationBody>('/api/datahub/post', {
    action: 'notify-create-failed',
    payload: input as any,
  })
}

async function notifyUpdatePostFailedOrRetryStatus(
  params: Omit<
    DatahubParams<{
      postId: string
      isRetrying?: {
        success: boolean
      }
      reason?: string
    }> & { timestamp: number },
    'txSig'
  >
) {
  const { timestamp, args } = params
  const { postId, isRetrying, ...otherArgs } = args
  const augmentedArgs = { ...otherArgs, timestamp: timestamp.toString() }
  const eventArgs = {
    ...augmentedArgs,
    persistentId: postId,
  }
  let event:
    | {
        name: (typeof socialCallName)['synth_update_post_tx_failed']
        args: SynthUpdatePostTxFailedCallParsedArgs
      }
    | {
        name: (typeof socialCallName)['synth_update_post_tx_retry']
        args: SynthUpdatePostTxRetryCallParsedArgs
      } = {
    name: socialCallName.synth_update_post_tx_failed,
    args: eventArgs,
  }
  if (isRetrying) {
    event = {
      name: socialCallName.synth_update_post_tx_retry,
      args: {
        ...eventArgs,
        success: isRetrying.success,
      },
    }
  }

  const input = createSignedSocialDataEvent(event.name, params, event.args)

  await axios.post<any, any, ApiDatahubPostMutationBody>('/api/datahub/post', {
    action: 'notify-update-failed',
    payload: input as any,
  })
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
  notifyCreatePostFailedOrRetryStatus: datahubWrapper(
    notifyCreatePostFailedOrRetryStatus
  ),
  notifyUpdatePostFailedOrRetryStatus: datahubWrapper(
    notifyUpdatePostFailedOrRetryStatus
  ),
}
export default datahubMutation

type SendOffchainMessageParams = SendMessageParams & {
  uuid: string
  timestamp: number
}
export function useSendOffchainMessage(
  config: UseMutationOptions<void, unknown, SendOffchainMessageParams, unknown>
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

      await datahubMutation.createPostData({
        ...getCurrentWallet(),
        uuid: data.uuid,
        timestamp: data.timestamp,
        isOffchain: true,
        args: {
          content: content,
          rootPostId: data.chatId,
          spaceId: data.hubId,
        },
      })
    },
    onMutate: async (data) => {
      config.onMutate?.(data)
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

      addOptimisticData({
        address:
          getCurrentWallet().proxyToAddress || getCurrentWallet().address,
        params: data,
        ipfsContent: content,
        client,
        customId: newId,
      })
      config.onMutate?.(data)
    },
    onError: (err, data, context) => {
      config.onError?.(err, data, context)
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
      config.onError?.(err, data, context)
    },
    onSuccess: (...params) => {
      config.onSuccess?.(...params)
      allowWindowUnload()
    },
  })
}
