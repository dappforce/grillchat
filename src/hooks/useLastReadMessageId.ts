import { LocalStorage } from '@/utils/storage'
import { useCallback } from 'react'

const getStorageKey = (chatId: string) => `last-read-${chatId}`
const storage = new LocalStorage(getStorageKey)

export default function useLastReadMessageId(chatId: string) {
  const getLastReadMessageId = useCallback(() => storage.get(chatId), [chatId])
  const setLastReadMessageId = useCallback(
    (id: string) => storage.set(id, chatId),
    [chatId]
  )
  return {
    getLastReadMessageId,
    setLastReadMessageId,
  }
}
