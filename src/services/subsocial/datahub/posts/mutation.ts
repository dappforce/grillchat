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
  proxyToAddress?: string

  isOffchain?: boolean

  uuid?: string
  timestamp?: number
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

function createSocialDataEventInput(
  callName: keyof typeof socialCallName,
  {
    isOffchain,
    timestamp,
    address,
    uuid,
    signer,
    proxyToAddress,
  }: DatahubParams<{}>,
  eventArgs: any,
  content?: string
) {
  const owner = proxyToAddress || address
  const input: SocialEventDataApiInput = {
    protVersion: socialEventProtVersion['0.1'],
    dataType: isOffchain
      ? SocialEventDataType.offChain
      : SocialEventDataType.optimistic,
    callData: {
      name: callName,
      signer: owner || '',
      args: JSON.stringify(eventArgs),
      timestamp: timestamp || Date.now(),
      uuid: uuid || crypto.randomUUID(),
      proxy: proxyToAddress ? address : undefined,
    },
    content: JSON.stringify(content),
    providerAddr: address,
    sig: '',
  }
  augmentInputSig(signer, input)

  return input
}

async function createPostData(
  params: DatahubParams<{
    rootPostId?: string
    spaceId: string
    cid: string
    content: PostContent
  }>
) {
  const { cid, rootPostId, spaceId, content } = params
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    spaceId,
    ipfsSrc: cid,
  }

  const input = createSocialDataEventInput(
    socialCallName.create_post,
    params,
    eventArgs,
    JSON.stringify(content)
  )

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
    action: 'create-post',
    payload: input as any,
  })
}

async function updatePostData(
  params: DatahubParams<{
    postId: string
    content: PostContent
    cid: string
  }>
) {
  const { postId, content, cid } = params
  const eventArgs: UpdatePostCallParsedArgs = {
    spaceId: null,
    hidden: null,
    postId,
    ipfsSrc: cid,
  }
  const input = createSocialDataEventInput(
    socialCallName.update_post,
    params,
    eventArgs,
    JSON.stringify(content)
  )

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
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
      timestamp: number
      reason?: string
      optimisticId: string
    }>,
    'txSig'
  >
) {
  const { address, isRetrying, signer, timestamp, ...args } = params
  const augmentedArgs = { ...args, timestamp: timestamp.toString() }
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

  const input = createSocialDataEventInput(event.name, params, event.args)

  await axios.post<any, any, DatahubMutationInput>('/api/datahub', {
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
      timestamp: number
    }>,
    'txSig'
  >
) {
  const { postId, address, isRetrying, signer, timestamp, ...args } = params
  const augmentedArgs = { ...args, timestamp: timestamp.toString() }
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

  const input = createSocialDataEventInput(event.name, params, event.args)

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
        isOffchain: true,
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
        account: getWallet().proxyToAddress || getWallet().address,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      addOptimisticData({
        address: getWallet().proxyToAddress || getWallet().address,
        params: data,
        ipfsContent: content,
        client,
        customId: newId,
      })
      config.onMutate?.(data)
    },
    onError: (err, data, context) => {
      const newId = getDeterministicId({
        account: getWallet().proxyToAddress || getWallet().address,
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
