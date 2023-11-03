import { getMaxMessageLength } from '@/constants/chat'
import { DatahubMutationInput } from '@/pages/api/datahub'
import { useSaveFile } from '@/services/api/mutation'
import { Signer } from '@/utils/account'
import { ReplyWrapper } from '@/utils/ipfs'
import { preventWindowUnload } from '@/utils/window'
import { decodeAddress } from '@polkadot/keyring'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { blake2AsHex } from '@polkadot/util-crypto'
import { PostContent } from '@subsocial/api/types'
import {
  CreatePostCallParsedArgs,
  socialCallName,
  SocialEventDataApiInput,
  SocialEventDataType,
  socialEventProtVersion,
  SynthCreatePostTxFailedCallParsedArgs,
  SynthCreatePostTxRetryCallParsedArgs,
  SynthUpdatePostTxFailedCallParsedArgs,
  SynthUpdatePostTxRetryCallParsedArgs,
  UpdatePostCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import sortKeys from 'sort-keys-recursive'
import { SendMessageParams } from '../../commentIds'
import {
  addOptimisticData,
  deleteOptimisticData,
} from '../../commentIds/optimistic'
import { useWalletGetter } from '../../hooks'
import { PostKind } from '../generated-query'

type DatahubParams<T> = T & {
  address: string
  signer: Signer | null
}

type GetDeterministicIdInput = {
  uuid: string
  timestamp: string
  account: string
}

function getDeterministicId({
  uuid,
  timestamp,
  account,
}: GetDeterministicIdInput): string {
  const pubKey = u8aToHex(decodeAddress(account), undefined, false)
  const u8aKey = stringToU8a(pubKey + timestamp + uuid)
  return blake2AsHex(u8aKey, 128, null, true)
}

function augmentInputSig(signer: Signer | null, payload: { sig: string }) {
  if (!signer) throw new Error('Signer is not defined')
  const sortedPayload = sortKeys(payload)
  const sig = signer.sign(JSON.stringify(sortedPayload))
  const hexSig = u8aToHex(sig)
  payload.sig = hexSig
}

async function createPostData({
  address,
  cid,
  rootPostId,
  spaceId,
  content,
  signer,
  isOffchainMessage,
  uuid,
  timestamp,
}: DatahubParams<{
  rootPostId?: string
  spaceId: string
  cid: string
  content: PostContent
  isOffchainMessage?: boolean
  uuid?: string
  timestamp?: number
}>) {
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    spaceId,
    ipfsSrc: cid,
  }

  // TODO: refactor input to reduce duplication with other inputs
  const input: SocialEventDataApiInput = {
    protVersion: socialEventProtVersion['0.1'],
    dataType: isOffchainMessage
      ? SocialEventDataType.offChain
      : SocialEventDataType.optimistic,
    callData: {
      name: socialCallName.create_post,
      signer: address || '',
      args: JSON.stringify(eventArgs),
      timestamp: timestamp || Date.now(),
      uuid: uuid || crypto.randomUUID(),
    },
    content: JSON.stringify(content),
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
    action: 'create-post',
    payload: input as any,
  })
}

async function updatePostData({
  address,
  postId,
  content,
  signer,
  cid,
}: DatahubParams<{
  postId: string
  content: PostContent
  cid: string
}>) {
  const eventArgs: UpdatePostCallParsedArgs = {
    spaceId: null,
    hidden: null,
    postId,
    ipfsSrc: cid,
  }

  const input: SocialEventDataApiInput = {
    protVersion: socialEventProtVersion['0.1'],
    dataType: SocialEventDataType.optimistic,
    callData: {
      name: socialCallName.update_post,
      signer: address || '',
      args: JSON.stringify(eventArgs),
      timestamp: Date.now(),
      uuid: crypto.randomUUID(),
    },
    providerAddr: address,
    content: JSON.stringify(content),
    sig: '',
  }
  augmentInputSig(signer, input)

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
    action: 'update-post',
    payload: input as any,
  })
}

async function notifyCreatePostFailedOrRetryStatus({
  address,
  isRetrying,
  signer,
  ...args
}: Omit<
  DatahubParams<{
    isRetrying?: {
      success: boolean
    }
    reason?: string
    optimisticId: string
    timestamp: string
  }>,
  'txSig'
>) {
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
    args,
  }
  if (isRetrying) {
    event = {
      name: socialCallName.synth_create_post_tx_retry,
      args: {
        ...args,
        success: isRetrying.success,
      },
    }
  }

  const input: SocialEventDataApiInput = {
    protVersion: socialEventProtVersion['0.1'],
    dataType: SocialEventDataType.offChain,
    callData: {
      name: event.name,
      signer: address || '',
      args: JSON.stringify(event.args),
      timestamp: Date.now(),
      uuid: crypto.randomUUID(),
    },
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
    action: 'notify-create-failed',
    payload: input as any,
  })
}

async function notifyUpdatePostFailedOrRetryStatus({
  postId,
  address,
  isRetrying,
  signer,
  ...args
}: Omit<
  DatahubParams<{
    postId: string
    isRetrying?: {
      success: boolean
    }
    reason?: string
    timestamp: string
  }>,
  'txSig'
>) {
  const eventArgs = {
    ...args,
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

  const input: SocialEventDataApiInput = {
    protVersion: socialEventProtVersion['0.1'],
    dataType: SocialEventDataType.offChain,
    callData: {
      name: event.name,
      signer: address || '',
      args: JSON.stringify(event.args),
      timestamp: Date.now(),
      uuid: crypto.randomUUID(),
    },
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
    action: 'notify-update-failed',
    payload: input as any,
  })
}

const datahubMutation = {
  createPostData,
  updatePostData,
  notifyCreatePostFailedOrRetryStatus,
  notifyUpdatePostFailedOrRetryStatus,
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
  const { mutateAsync: saveFile } = useSaveFile()
  const getWallet = useWalletGetter()

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

      const res = await saveFile(content)
      const cid = res.cid
      if (!cid) throw new Error('Failed to save file')

      await datahubMutation.createPostData({
        ...getWallet(),
        uuid: data.uuid,
        timestamp: data.timestamp,
        isOffchainMessage: true,
        content: content,
        cid: cid,
        rootPostId: data.chatId,
        spaceId: data.hubId,
      })
    },
    onMutate: async (data) => {
      preventWindowUnload()
      const content = {
        body: data.message,
        inReplyTo: ReplyWrapper(data.replyTo),
        extensions: data.extensions,
      } as PostContent

      const newId = getDeterministicId({
        account: getWallet().address,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      addOptimisticData({
        address: getWallet().address,
        params: data,
        ipfsContent: content,
        client,
        customId: newId,
      })
      config.onMutate?.(data)
    },
    onError: (err, data, context) => {
      const newId = getDeterministicId({
        account: getWallet().address,
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
  })
}
