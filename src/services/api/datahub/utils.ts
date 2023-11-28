import { Signer } from '@/utils/account'
import { u8aToHex } from '@polkadot/util'
import { PostContent } from '@subsocial/api/types'
import {
  socialCallName,
  SocialEventDataApiInput,
  SocialEventDataType,
  socialEventProtVersion,
} from '@subsocial/data-hub-sdk'
import sortKeysRecursive from 'sort-keys-recursive'

export type DatahubParams<T> = {
  address: string
  signer: Signer | null
  proxyToAddress?: string

  isOffchain?: boolean

  uuid?: string
  timestamp?: number

  args: T
}

function augmentInputSig(signer: Signer | null, payload: { sig: string }) {
  if (!signer) throw new Error('Signer is not defined')
  const sortedPayload = sortKeysRecursive(payload)
  const sig = signer.sign(JSON.stringify(sortedPayload))
  const hexSig = u8aToHex(sig)
  payload.sig = hexSig
}

export function createSocialDataEventInput(
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
  content?: PostContent
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
