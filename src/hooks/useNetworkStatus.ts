import { useTransactions } from '@/stores/transactions'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { ApiPromise } from '@polkadot/api'
import { useCallback, useEffect, useState } from 'react'
import useWrapInRef from './useWrapInRef'

export default function useNetworkStatus() {
  const [status, setStatus] = useState<'connecting' | 'error' | 'connected'>(
    'connecting'
  )
  const [substrateApi, setSubstrateApi] = useState<ApiPromise | null>(null)

  const [shouldDisconnect, setShouldDisconnect] = useState(false)
  const shouldDisconnectRef = useWrapInRef(shouldDisconnect)

  const subscriptionState = useTransactions((state) => state.subscriptionState)
  const pendingTransactions = useTransactions(
    (state) => state.pendingTransactions
  )

  const canUnsub =
    pendingTransactions.size === 0 && subscriptionState === 'dynamic'
  const canUnsubRef = useWrapInRef(canUnsub)

  const disconnectAfter1Min = useCallback(() => {
    setTimeout(() => {
      if (!shouldDisconnectRef.current || !canUnsubRef.current) return

      substrateApi?.disconnect()
      setShouldDisconnect(false)
    }, 60_000)
  }, [canUnsubRef, shouldDisconnectRef, substrateApi])

  useEffect(() => {
    if (canUnsub && shouldDisconnect) {
      disconnectAfter1Min()
    }
  }, [canUnsub, shouldDisconnect, disconnectAfter1Min])

  const disconnect = useCallback(() => {
    if (substrateApi) {
      setShouldDisconnect(true)
    }
  }, [substrateApi])
  const connect = useCallback(() => {
    setShouldDisconnect(false)
    if (substrateApi && !substrateApi.isConnected) {
      substrateApi.connect()
    }
  }, [substrateApi])
  const reconnect = useCallback(async () => {
    setShouldDisconnect(false)
    if (substrateApi) {
      await substrateApi.disconnect()
      await substrateApi.connect()
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
