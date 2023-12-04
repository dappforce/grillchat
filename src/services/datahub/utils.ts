import { getDatahubConfig } from '@/utils/env/client'
import { wait } from '@/utils/promise'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { Client, createClient } from 'graphql-ws'
import ws from 'isomorphic-ws'

export function datahubQueryRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { queryUrl } = getDatahubConfig() || {}
  if (!queryUrl) throw new Error('Datahub (Query) config is not set')

  const TIMEOUT = 10 * 1000 // 10 seconds
  const client = new GraphQLClient(queryUrl, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url: queryUrl, ...config })
}

let client: Client | null = null
function getClient() {
  const { subscriptionUrl } = getDatahubConfig() || {}
  if (!subscriptionUrl)
    throw new Error('Datahub (Subscription) config is not set')
  if (!client) {
    client = createClient({
      webSocketImpl: ws,
      url: subscriptionUrl,
      shouldRetry: () => true,
      retryWait: async (attempt) => {
        await wait(2 ** attempt * 1000)
      },
    })
  }
  return client
}
export function datahubSubscription() {
  return getClient()
}

import { Signer } from '@/utils/account'
import { u8aToHex } from '@polkadot/util'
import { PostContent } from '@subsocial/api/types'
import {
  SocialCallDataArgs,
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

export function signDatahubPayload(
  signer: Signer | null,
  payload: { sig: string }
) {
  if (!signer) throw new Error('Signer is not defined')
  const sortedPayload = sortKeysRecursive(payload)
  const sig = signer.sign(JSON.stringify(sortedPayload))
  const hexSig = u8aToHex(sig)
  payload.sig = hexSig
}

export function createSocialDataEventPayload<
  T extends keyof typeof socialCallName
>(
  callName: T,
  { isOffchain, timestamp, address, uuid, proxyToAddress }: DatahubParams<{}>,
  eventArgs: SocialCallDataArgs<T>,
  content?: PostContent
) {
  const owner = proxyToAddress || address
  const payload: SocialEventDataApiInput = {
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
  return payload
}

export function createSignedSocialDataEvent<
  T extends keyof typeof socialCallName
>(
  callName: T,
  params: DatahubParams<{}>,
  eventArgs: SocialCallDataArgs<T>,
  content?: PostContent
) {
  const payload = createSocialDataEventPayload(
    callName,
    params,
    eventArgs,
    content
  )
  signDatahubPayload(params.signer, payload)

  return payload
}
