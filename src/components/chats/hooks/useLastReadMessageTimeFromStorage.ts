import { getPostQuery } from '@/services/api/query'
import { LocalForage, LocalStorage } from '@/utils/storage'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const oldGetStorageKey = (chatId: string) => `last-read-${chatId}`
export const oldLastReadStorage = new LocalStorage(oldGetStorageKey)

const getStorageKey = (chatId: string) => `last-read-timestamp-${chatId}`
export const lastReadStorage = new LocalStorage(getStorageKey)

// need localforage instead of localStorage because needs to be used in service worker
export const lastReadTimeLocalForage = new LocalForage(getStorageKey)

export default function useLastReadTimeFromStorage(chatId: string) {
  const client = useQueryClient()
  const setLastReadTime = useCallback(
    (createdAtTime: number) => {
      const isoDate = new Date(createdAtTime).toISOString()
      lastReadStorage.set(createdAtTime.toString(), chatId)
      lastReadTimeLocalForage.set(new Date(isoDate).toISOString(), chatId)
    },
    [chatId]
  )

  const getLastReadTime = useCallback(() => {
    const data = lastReadStorage.get(chatId)
    const oldData = oldLastReadStorage.get(chatId)
    if (data) {
      return parseInt(data)
    } else if (oldData) {
      // for backward compatible
      getPostQuery
        .fetchQuery(client, chatId)
        .then((post) => {
          if (post) {
            const createdAtTime = post.struct.createdAtTime
            setLastReadTime(createdAtTime)
          }
        })
        .catch()
    }
    return Date.now()
  }, [chatId, client, setLastReadTime])

  return {
    getLastReadTime,
    setLastReadTime,
  }
}
