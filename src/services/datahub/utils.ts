import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { createClient } from 'graphql-ws'

export function datahubRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = 'http://localhost:3003'
  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}

export function datahubSubscription() {
  return createClient({
    url: 'ws://localhost:3030/graphql',
  })
}
