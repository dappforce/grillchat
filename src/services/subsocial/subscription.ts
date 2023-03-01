import useWaitNewBlock from '@/hooks/useWaitNewBlock'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { SubsocialApi } from '@subsocial/api'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getCommentIdsQueryKey, getCommentQuery } from './queries'
import { isOptimisticId } from './utils'

let lastSubscribedId = ''
function getLastSubscribedId() {
  return lastSubscribedId
}
function setLastSubscribedId(id: string) {
  lastSubscribedId = id
}

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean,
  callback?: (ids: string[]) => void
) {
  const queryClient = useQueryClient()
  const waitNewBlock = useWaitNewBlock()
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    let unsub: Promise<() => void> | undefined
    ;(async () => {
      const subsocialApi = await getSubsocialApi()
      const substrateApi = await subsocialApi.substrateApi
      unsub = substrateApi.query.posts.replyIdsByPostId(postId, async (ids) => {
        const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
        const lastId = newIds[newIds.length - 1]
        const lastSubscribedId = getLastSubscribedId()
        setLastSubscribedId(lastId)

        if (!lastSubscribedId) {
          queryClient.setQueriesData<string[]>(
            getCommentIdsQueryKey(postId),
            (oldIds) => {
              const optimisticIds = oldIds?.filter((id) => isOptimisticId(id))
              return [...newIds, ...(optimisticIds ?? [])]
            }
          )
          callbackRef.current?.(newIds)
          return
        }

        const lastIdIndex = newIds.findIndex((id) => id === lastSubscribedId)
        const newIdsToFetch = newIds.slice(lastIdIndex + 1)
        newIdsToFetch.forEach((id) =>
          getNewComment(queryClient, subsocialApi, postId, id, waitNewBlock)
        )
      })
    })()
    return () => {
      unsub?.then((func) => func())
    }
  }, [postId, queryClient, enabled, waitNewBlock])
}

async function getNewComment(
  queryClient: QueryClient,
  api: SubsocialApi,
  rootPostId: string,
  id: string,
  waitNewBlock: () => Promise<void>
) {
  await waitNewBlock()

  const post = await api.findPost({ id })
  if (post) {
    queryClient.setQueriesData(getCommentQuery.getQueryKey(post.id), post)
    queryClient.setQueriesData<string[]>(
      getCommentIdsQueryKey(rootPostId),
      (oldIds) => {
        const oldIdsWithoutOptimistic: string[] = []
        const optimisticIds: string[] = []
        oldIds?.forEach((id) => {
          if (isOptimisticId(id)) {
            optimisticIds.push(id)
          } else {
            oldIdsWithoutOptimistic.push(id)
          }
        })
        return [...oldIdsWithoutOptimistic, id, ...(optimisticIds ?? [])]
      }
    )
  }
}
