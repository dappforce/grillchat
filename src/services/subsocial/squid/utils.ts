import { getSquidUrl } from '@/utils/env/client'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function squidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = getSquidUrl()
  if (!url) throw new Error('Squid URL is not defined')

  const SQUID_TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: SQUID_TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}
