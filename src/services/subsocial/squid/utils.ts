import { env } from '@/env.mjs'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

const squidUrl = env.NEXT_PUBLIC_SQUID_URL

export const isSquidAvailable = !!squidUrl

export function squidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  if (!squidUrl) throw new Error('Squid URL is not defined')

  const SQUID_TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(squidUrl, {
    timeout: SQUID_TIMEOUT,
    ...config,
  })

  return client.request({ url: squidUrl, ...config })
}
