import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { ApiPromise } from '@polkadot/api'
import { useCallback, useEffect, useState } from 'react'

export default function useNetworkStatus() {
  const [status, setStatus] = useState<'connecting' | 'error' | 'connected'>(
    'connecting'
  )
  const [substrateApi, setSubstrateApi] = useState<ApiPromise | null>(null)
  const disconnect = useCallback(() => {
    if (substrateApi) substrateApi.disconnect()
  }, [substrateApi])
  const connect = useCallback(() => {
    if (substrateApi && !substrateApi.isConnected) substrateApi.connect()
  }, [substrateApi])
  const reconnect = useCallback(() => {
    if (substrateApi) {
      substrateApi.disconnect()
      substrateApi.connect()
    }
  }, [substrateApi])

  useEffect(() => {
    getSubsocialApi().then((api) =>
      api.substrateApi.then((substrateApi) => {
        if (substrateApi.isConnected) setStatus('connected')
        setSubstrateApi(substrateApi)
      })
    )
  }, [])

  useEffect(() => {
    if (!substrateApi) return

    const onError = () => setStatus('error')
    const onDisconnected = () => setStatus('connecting')
    const onConnected = () => setStatus('connected')

    substrateApi.on('error', onError)
    substrateApi.on('disconnected', onDisconnected)
    substrateApi.on('connected', onConnected)
    substrateApi.on('ready', onConnected)

    return () => {
      substrateApi.off('error', onError)
      substrateApi.off('disconnected', onDisconnected)
      substrateApi.off('connected', onConnected)
      substrateApi.off('ready', onConnected)
    }
  }, [substrateApi])

  return { status, reconnect, connect, disconnect }
}
