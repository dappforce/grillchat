import { getApiPromiseInstance } from '@/subsocial-query/subsocial/connection'
import { ApiPromise } from '@polkadot/api'
import { useCallback, useEffect, useState } from 'react'

export default function useNetworkStatus() {
  const [status, setStatus] = useState<'connecting' | 'error' | 'connected'>(
    'connecting'
  )
  const [api, setApi] = useState<ApiPromise | null>(null)
  const reconnect = useCallback(() => {
    if (api) {
      api.disconnect()
      api.connect()
    }
  }, [api])

  useEffect(() => {
    ;(async () => {
      const api = await getApiPromiseInstance()
      setApi(api)
      if (!api) return

      api.on('error', () => setStatus('error'))
      api.on('disconnected', () => setStatus('connecting'))

      api.on('connected', () => setStatus('connected'))
      api.on('ready', () => setStatus('connected'))
    })()
  }, [])

  return { status, reconnect }
}
