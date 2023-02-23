import { getSubsocialApi } from '@/subsocial-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { commentIdsByPostIdKey } from './queries'

export function useSubscribeCommentIdsByPostId(
  postId: string,
  startSubscribe?: boolean
) {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!startSubscribe) return

    let unsub: () => void = () => undefined
    ;(async () => {
      const subsocialApi = await getSubsocialApi()
      const substrateApi = await subsocialApi.substrateApi
      unsub = await substrateApi.query.posts.replyIdsByPostId(postId, (ids) => {
        const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
        queryClient.setQueriesData([commentIdsByPostIdKey, postId], newIds)
      })
    })()
    return unsub
  }, [postId, queryClient, startSubscribe])
}
