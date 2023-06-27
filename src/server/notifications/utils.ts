import { getNotificationsConfig } from '@/utils/env/server'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export function notificationsRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { url, token } = getNotificationsConfig()
  if (!url || !token) throw new Error('Notifications config not found')

  const TIMEOUT = 1 * 1000 // 1 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    headers: {
      authorization: `Bearer ${token}`,
    },
    ...config,
  })

  return client.request({ url, ...config })
}
