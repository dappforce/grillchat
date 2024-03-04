import { useMyMainAddress } from '@/stores/my-account'
import { isServer } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'

// This is to integrate storage items from polkaverse
const storagePrefix = 'df.'
function truncateAddress(address: string) {
  const suffix = address.substring(address.length - 4, address.length)
  const prefix = address.substring(0, 4)
  return `${prefix}...${suffix}`
}
export function createStorageKey(name: string, address?: string) {
  return storagePrefix + name + (address ? `:${truncateAddress(address)}` : '')
}

const getStorageData = (key: string) => {
  if (isServer) return ''
  return localStorage.getItem(key) ?? ''
}
const setStorageData = (key: string, newData: string) => {
  if (isServer) return
  localStorage.setItem(key, newData)
}
const removeStorageData = (key: string) => {
  if (isServer) return
  localStorage.removeItem(key)
}

type UseExternalStorageConfig<T> = {
  parseStorageToState?: (data: string) => T
  parseStateToStorage?: (data: T) => string | undefined
  storageKeyType?: 'guest' | 'user' | 'both'
  subscribe?: boolean
}

export function useExternalStorage<T = string>(
  key: string,
  config?: UseExternalStorageConfig<T>
) {
  const address = useMyMainAddress()

  const storageKeyType = config?.storageKeyType ?? 'both'
  const parseStorageToState =
    config?.parseStorageToState ?? ((data) => data as T)
  const parseStateToStorage =
    config?.parseStateToStorage ?? ((data) => data as string)

  const storageKey = useMemo(() => {
    if (storageKeyType === 'user' && !address) return

    let storageKey = createStorageKey(key, address ?? '')
    if (storageKeyType === 'guest') {
      storageKey = createStorageKey(key)
    }
    return storageKey
  }, [key, address, storageKeyType])

  const [data, _setData] = useState<T>()

  const syncData = useCallback(() => {
    if (!storageKey) return
    const storageData = getStorageData(storageKey)
    _setData(parseStorageToState(storageData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    syncData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, storageKeyType])

  useEffect(() => {
    if (!config?.subscribe) return

    window.addEventListener('storage', () => {
      syncData()
    })
  }, [config?.subscribe, syncData])

  const setData = useCallback(
    (newData: T | undefined, tempAddress?: string) => {
      _setData(newData)
      if (!storageKey) return
      if (newData === undefined) {
        removeStorageData(storageKey)
      } else {
        const newStorageData = parseStateToStorage(newData)
        if (newStorageData === undefined) removeStorageData(storageKey)
        else {
          if (tempAddress) {
            setStorageData(createStorageKey(key, tempAddress), newStorageData)
            return
          }
          setStorageData(storageKey, newStorageData)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, address]
  )

  const getDataForAddress = useCallback(
    (address: string) => {
      const storageKey = createStorageKey(key, address)
      const storageData = getStorageData(storageKey)
      return parseStorageToState(storageData)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  )

  return {
    data,
    setData,
    getDataForAddress,
  }
}
