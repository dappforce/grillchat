import { getSubsocialApi } from '@/subsocial-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getCommentIdsQueryKey } from './queries'

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean,
  callback?: (ids: string[]) => void
) {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!enabled) return

    let unsub: Promise<() => void> | undefined
    ;(async () => {
      const subsocialApi = await getSubsocialApi()
      const substrateApi = await subsocialApi.substrateApi
      unsub = substrateApi.query.posts.replyIdsByPostId(postId, (ids) => {
        const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
        queryClient.setQueriesData(getCommentIdsQueryKey(postId), newIds)
        callback?.(newIds)
      })
    })()
    return () => {
      unsub?.then((func) => func())
    }
  }, [postId, queryClient, enabled, callback])
}
