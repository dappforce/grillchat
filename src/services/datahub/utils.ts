import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

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
