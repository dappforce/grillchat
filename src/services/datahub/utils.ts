import { getDatahubConfig } from '@/utils/env/client'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { Client, createClient } from 'graphql-ws'
import ws from 'isomorphic-ws'

export function datahubQueryRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { queryUrl } = getDatahubConfig() || {}
  if (!queryUrl) throw new Error('Datahub (Query) config is not set')

  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(queryUrl, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url: queryUrl, ...config })
}

export function datahubMutationRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { mutationUrl } = getDatahubConfig() || {}
  if (!mutationUrl) throw new Error('Datahub (Mutation) config is not set')

  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(mutationUrl, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ mutationUrl, ...config })
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
    })
  }
  return client
}
export function datahubSubscription() {
  return getClient()
}
