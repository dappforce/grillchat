import { getSubsocialApi } from '@/subsocial-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getCommentIdsQueryKey } from './queries'

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean,
  callback?: (ids: string[]) => void
) {
  const queryClient = useQueryClient()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    let unsub: Promise<() => void> | undefined
    ;(async () => {
      const subsocialApi = await getSubsocialApi()
      const substrateApi = await subsocialApi.substrateApi
      unsub = substrateApi.query.posts.replyIdsByPostId(postId, (ids) => {
        const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
        queryClient.setQueriesData(getCommentIdsQueryKey(postId), newIds)
        callbackRef.current?.(newIds)
      })
    })()
    return () => {
      unsub?.then((func) => func())
    }
  }, [postId, queryClient, enabled])
}
