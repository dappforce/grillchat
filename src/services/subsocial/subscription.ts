import useWaitNewBlock from '@/hooks/useWaitNewBlock'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getCommentIdsQueryKey } from './queries'
import { isOptimisticId } from './utils'

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean,
  callbackFirstResult?: (ids: string[]) => void
) {
  const queryClient = useQueryClient()
  const waitNewBlock = useWaitNewBlock()

  const lastSubscribedIdRef = useRef('')
  const callbackRef = useRef(callbackFirstResult)
  callbackRef.current = callbackFirstResult

  useEffect(() => {
    if (!enabled) return

    let unsub: Promise<() => void> | undefined
    ;(async () => {
      const subsocialApi = await getSubsocialApi()
      const substrateApi = await subsocialApi.substrateApi
      unsub = substrateApi.query.posts.replyIdsByPostId(postId, async (ids) => {
        const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
        const lastId = newIds[newIds.length - 1]
        const lastSubscribedId = lastSubscribedIdRef.current
        lastSubscribedIdRef.current = lastId

        function updateQueryData() {
          queryClient.setQueriesData<string[]>(
            getCommentIdsQueryKey(postId),
            (oldIds) => {
              const optimisticIds = oldIds?.filter((id) => isOptimisticId(id))
              return [...newIds, ...(optimisticIds ?? [])]
            }
          )
        }

        // first subscription, set data immediately
        if (!lastSubscribedId) {
          updateQueryData()
          callbackRef.current?.(newIds)
          return
        }

        // consecutive subscription, set data after new block
        await waitNewBlock()
        updateQueryData()
      })
    })()
    return () => {
      unsub?.then((func) => func())
      lastSubscribedIdRef.current = ''
    }
  }, [postId, queryClient, enabled, waitNewBlock])
}
