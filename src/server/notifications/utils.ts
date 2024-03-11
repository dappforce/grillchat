import { env } from '@/env.mjs'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

function getNotificationsConfig() {
  return {
    url: env.NOTIFICATIONS_URL,
    token: env.NOTIFICATIONS_TOKEN,
  }
}

export function notificationsRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { url, token } = getNotificationsConfig()
  if (!url || !token) throw new Error('Notifications config not found')

  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    headers: {
      authorization: `Bearer ${token}`,
    },
    ...config,
  })

  return client.request({ url, ...config })
}
