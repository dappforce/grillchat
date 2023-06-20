import { getSquidUrl } from '@/utils/env/client'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function squidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = getSquidUrl()
  if (!url) throw new Error('Squid URL is not defined')

  const client = new GraphQLClient(url, {
    timeout: 1000,
    ...config,
  })

  return client.request({ url, ...config })
}
