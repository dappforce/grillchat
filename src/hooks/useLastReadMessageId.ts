import { LocalForage, LocalStorage } from '@/utils/storage'
import { useCallback } from 'react'

const getStorageKey = (chatId: string) => `last-read-${chatId}`
export const lastReadStorage = new LocalStorage(getStorageKey)

// need localforage instead of localStorage because needs to be used in service worker
const localforage = new LocalForage(getStorageKey)

export default function useLastReadMessageIdFromStorage(chatId: string) {
  const getLastReadMessageId = useCallback(
    () => lastReadStorage.get(chatId),
    [chatId]
  )
  const setLastReadMessageId = useCallback(
    (id: string, createdAtTime?: number) => {
      lastReadStorage.set(id, chatId)
      if (createdAtTime)
        localforage.set(new Date(createdAtTime).toISOString(), chatId)
    },
    [chatId]
  )
  return {
    getLastReadMessageId,
    setLastReadMessageId,
  }
}
