import { getApiPromiseInstance } from '@/subsocial-query/subsocial/connection'
import { useEffect, useState } from 'react'

export default function useNetworkStatus() {
  const [status, setStatus] = useState<'connecting' | 'error' | 'connected'>(
    'connecting'
  )

  useEffect(() => {
    ;(async () => {
      const api = await getApiPromiseInstance()
      if (!api) return

      api.on('error', () => setStatus('error'))
      api.on('disconnected', () => setStatus('connecting'))

      api.on('connected', () => setStatus('connected'))
      api.on('ready', () => setStatus('connected'))
    })()
  }, [])

  return status
}
