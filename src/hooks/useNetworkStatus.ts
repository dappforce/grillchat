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
  const pendingTransactions = useTransactions(
    (state) => state.pendingTransactions
  )
  const pendingTransactionsRef = useWrapInRef(pendingTransactions)

  useEffect(() => {
    if (pendingTransactions.size === 0 && shouldDisconnect) {
      substrateApi?.disconnect()
      setShouldDisconnect(false)
    }
  }, [pendingTransactions, substrateApi, shouldDisconnect])

  const disconnect = useCallback(() => {
    if (substrateApi) {
      if (pendingTransactionsRef.current.size > 0) {
        setShouldDisconnect(true)
      } else {
        substrateApi.disconnect()
      }
    }
  }, [substrateApi, pendingTransactionsRef])
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
