import { env } from '@/env.mjs'
import { init, NodeClient, OfflineRetryHandler } from '@amplitude/node'

let amplitudeClient: NodeClient | null = null
export function getAmplitudeServerClient() {
  if (amplitudeClient) return amplitudeClient
  const apiKey = env.NEXT_PUBLIC_AMP_ID
  if (!apiKey) return null
  amplitudeClient = init(env.NEXT_PUBLIC_AMP_ID, {
    retryClass: new OfflineRetryHandler(env.NEXT_PUBLIC_AMP_ID),
  })
  return amplitudeClient
}

export function sendServerEvent(
  eventName: string,
  eventProps?: Record<string, any>
) {
  const event = {
    ...eventProps,
    event_type: eventName,
    user_id: 'Epic App Server',
  }
  const client = getAmplitudeServerClient()
  if (!client) return
  client.logEvent(event).then()
}
