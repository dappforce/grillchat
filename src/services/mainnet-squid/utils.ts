import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function mainnetSquidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const TIMEOUT = 3 * 1000 // 3 seconds
  const url = 'https://squid.subsquid.io/subsocial/graphql'
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    ...config,
  })
  return client.request({ url, ...config })
}
