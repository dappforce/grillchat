import axios from 'axios'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function getSubIdRequest() {
  return axios.create({ baseURL: 'https://sub.id/api/v1' })
}

export function subsocialSquidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = 'https://squid.subsquid.io/subsocial/graphql'

  const SQUID_TIMEOUT = 10 * 1000 // 10 seconds
  const client = new GraphQLClient(url, {
    timeout: SQUID_TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}
