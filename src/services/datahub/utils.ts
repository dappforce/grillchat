import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { Client, createClient } from 'graphql-ws'
import ws from 'isomorphic-ws'

export function datahubQueryRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = 'https://first-test-data-hub.subsocial.network/graphql'
  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}

export function datahubMutationRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = 'https://first-test-queue-data-hub.subsocial.network/graphql'
  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}

let client: Client | null = null
function getClient() {
  if (!client) {
    client = createClient({
      webSocketImpl: ws,
      url: 'wss://first-test-data-hub.subsocial.network/graphql-ws',
    })
  }
  return client
}
export function datahubSubscription() {
  return getClient()
}
