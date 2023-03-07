import { useCallback } from 'react'

const getStorageKey = (postId: string) => `last-read-${postId}`

export default function useLastReadMessageId(postId: string) {
  const getLastReadMessageId = useCallback(
    () => localStorage.getItem(getStorageKey(postId)),
    [postId]
  )
  const setLastReadMessageId = useCallback(
    (id: string) => localStorage.setItem(getStorageKey(postId), id),
    [postId]
  )
  return {
    getLastReadMessageId,
    setLastReadMessageId,
  }
}
