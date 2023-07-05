import { getModerationUrl } from '@/utils/env/client'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function moderationRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(getModerationUrl(), {
    timeout: TIMEOUT,
    ...config,
  })
  return client.request({ url: getModerationUrl(), ...config })
}
