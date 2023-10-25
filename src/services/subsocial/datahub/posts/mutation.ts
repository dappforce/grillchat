import { DatahubMutationInput } from '@/pages/api/datahub'
import { Signer } from '@/utils/account'
import { u8aToHex } from '@polkadot/util'
import { PostContent } from '@subsocial/api/types'
import {
  CreatePostCallParsedArgs,
  socialCallName,
  SocialEventDataApiInput,
  SocialEventDataType,
  SynthCreatePostTxFailedCallParsedArgs,
  SynthCreatePostTxRetryCallParsedArgs,
  SynthUpdatePostTxFailedCallParsedArgs,
  SynthUpdatePostTxRetryCallParsedArgs,
  UpdatePostCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import axios from 'axios'
import sortKeys from 'sort-keys-recursive'
import { PostKind } from '../generated-query'

type DatahubParams<T> = T & {
  address: string
  signer: Signer | null
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
}: DatahubParams<{
  rootPostId?: string
  spaceId: string
  cid: string
  content: PostContent
}>) {
  const eventArgs: CreatePostCallParsedArgs = {
    forced: false,
    postKind: rootPostId ? PostKind.Comment : PostKind.RegularPost,
    rootPostId,
    spaceId,
    ipfsSrc: cid,
  }

  const input: SocialEventDataApiInput = {
    dataType: SocialEventDataType.optimistic,
    callData: {
      name: socialCallName.create_post,
      signer: address || '',
      args: JSON.stringify(eventArgs),
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
    dataType: SocialEventDataType.optimistic,
    callData: {
      name: socialCallName.update_post,
      signer: address || '',
      args: JSON.stringify(eventArgs),
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
    dataType: SocialEventDataType.offChain,
    callData: {
      name: event.name,
      signer: address || '',
      args: JSON.stringify(event.args),
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
    dataType: SocialEventDataType.offChain,
    callData: {
      name: event.name,
      signer: address || '',
      args: JSON.stringify(event.args),
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
