import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { createClient } from 'graphql-ws'

export function datahubRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = 'https://staging-data-hub-service.subsocial.network/graphql'
  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}

export function datahubSubscription() {
  return createClient({
    url: 'wss://staging-data-hub-service.subsocial.network/graphql-ws',
  })
}
