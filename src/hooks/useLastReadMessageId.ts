import { LocalStorage } from '@/utils/storage'
import { useCallback } from 'react'

const getStorageKey = (postId: string) => `last-read-${postId}`
const storage = new LocalStorage(getStorageKey)

export default function useLastReadMessageId(postId: string) {
  const getLastReadMessageId = useCallback(() => storage.get(postId), [postId])
  const setLastReadMessageId = useCallback(
    (id: string) => storage.set(id, postId),
    [postId]
  )
  return {
    getLastReadMessageId,
    setLastReadMessageId,
  }
}
