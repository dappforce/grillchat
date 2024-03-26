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
  if (!url) throw new Error('Notifications URL not found')
  if (!token) throw new Error('Notifications TOKEN not found')

  const TIMEOUT = 10 * 1000 // 10 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    headers: {
      authorization: `Bearer ${token}`,
    },
    ...config,
  })

  return client.request({ url, ...config })
}
