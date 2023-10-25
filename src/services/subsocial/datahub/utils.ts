import { getDatahubConfig } from '@/utils/env/client'
import { wait } from '@/utils/promise'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { Client, createClient } from 'graphql-ws'
import ws from 'isomorphic-ws'

export function datahubQueryRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { queryUrl } = getDatahubConfig() || {}
  if (!queryUrl) throw new Error('Datahub (Query) config is not set')

  const TIMEOUT = 10 * 1000 // 10 seconds
  const client = new GraphQLClient(queryUrl, {
    timeout: TIMEOUT,
    ...config,
  })

  return client.request({ url: queryUrl, ...config })
}

let client: Client | null = null
function getClient() {
  const { subscriptionUrl } = getDatahubConfig() || {}
  if (!subscriptionUrl)
    throw new Error('Datahub (Subscription) config is not set')
  if (!client) {
    client = createClient({
      webSocketImpl: ws,
      url: subscriptionUrl,
      shouldRetry: () => true,
      retryWait: async (attempt) => {
        await wait(2 ** attempt * 1000)
      },
    })
  }
  return client
}
export function datahubSubscription() {
  return getClient()
}
