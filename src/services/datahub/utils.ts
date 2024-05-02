import { env } from '@/env.mjs'
import { Signer } from '@/utils/account'
import { wait } from '@/utils/promise'
import { PostContent } from '@subsocial/api/types'
import {
  SocialCallDataArgs,
  SocialEventDataApiInput,
  SocialEventDataType,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { Client, createClient } from 'graphql-ws'
import ws from 'isomorphic-ws'
import sortKeysRecursive from 'sort-keys-recursive'

const queryUrl = env.NEXT_PUBLIC_DATAHUB_QUERY_URL
const subscriptionUrl = env.NEXT_PUBLIC_DATAHUB_SUBSCRIPTION_URL

export const isDatahubAvailable = !!(queryUrl && subscriptionUrl)

export function datahubQueryRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
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
  const sig = signer.signMessageSync(JSON.stringify(sortedPayload))
  payload.sig = sig
}

export function createSocialDataEventPayload<
  T extends keyof typeof socialCallName
>(
  callName: T,
  {
    timestamp,
    address,
    uuid,
    proxyToAddress,
  }: Pick<
    DatahubParams<{}>,
    'timestamp' | 'address' | 'uuid' | 'proxyToAddress'
  >,
  eventArgs: SocialCallDataArgs<T>,
  content?: PostContent
) {
  const owner = proxyToAddress || address
  const payload: SocialEventDataApiInput = {
    protVersion: '0.1',
    dataType: SocialEventDataType.offChain,
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
  content?: any
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

export function augmentDatahubParams<T>(
  params: T
): { uuid: string; timestamp: number } & T {
  return {
    ...params,
    uuid: crypto.randomUUID(),
    timestamp: Date.now(),
  }
}
