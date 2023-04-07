import useWrapCallbackInRef from '@/hooks/useWrapCallbackInRef'
import { getPostQuery, getPosts } from '@/services/api/query'
import { PostData } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { extractOptimisticIdData, isOptimisticId } from '../utils'
import { getCommentIdsQueryKey } from './query'
import { OptimisticMessageIdData } from './types'

const subscribedPostIds = new Set<string>()
const subscription = (
  enabled: boolean,
  postId: string,
  queryClient: QueryClient,
  lastIdInPreviousSub: {
    get: () => string | undefined
    set: (id: string) => void
  },
  callback?: (ids: string[]) => void
) => {
  if (!enabled || subscribedPostIds.has(postId)) return
  subscribedPostIds.add(postId)

  let unsub: Promise<() => void> = (async () => {
    const { getSubsocialApi } = await import(
      '@/subsocial-query/subsocial/connection'
    )
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi

    return substrateApi.query.posts.replyIdsByPostId(postId, async (ids) => {
      const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
      const lastId = newIds[newIds.length - 1]
      const lastSubscribedId = lastIdInPreviousSub.get()

      lastIdInPreviousSub.set(lastId)

      function updateQueryData() {
        queryClient.setQueryData<string[]>(
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
        callback?.(newIds)
        return
      }

      // consecutive subscription, set data after new block
      const lastSubscribedIdIndex = newIds.findIndex(
        (id) => id === lastSubscribedId
      )
      const newIdsAfterLastSubscribed = newIds.slice(lastSubscribedIdIndex + 1)
      if (!newIdsAfterLastSubscribed.length) {
        updateQueryData()
        return
      }

      const newPosts = await getPosts(newIdsAfterLastSubscribed)
      newPosts.forEach((post) => {
        getPostQuery.setQueryData(queryClient, post.id, post)
      })
      queryClient.setQueryData<string[]>(
        getCommentIdsQueryKey(postId),
        (oldIds) => {
          const optimisticIds = oldIds?.filter((id) => isOptimisticId(id))
          return [
            ...newIds,
            ...(filterOptimisticIds(newPosts, optimisticIds) ?? []),
          ]
        }
      )
    })
  })()

  return unsub
}

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean,
  callbackFirstResult?: (ids: string[]) => void
) {
  const queryClient = useQueryClient()

  const lastIdInPreviousSub = useRef('')
  const callbackRef = useWrapCallbackInRef(callbackFirstResult)

  useEffect(() => {
    const unsub = subscription(
      enabled,
      postId,
      queryClient,
      {
        get: () => lastIdInPreviousSub.current,
        set: (id) => (lastIdInPreviousSub.current = id),
      },
      callbackRef.current
    )

    return () => {
      unsub?.then((func) => func())
      subscribedPostIds.delete(postId)
      lastIdInPreviousSub.current = ''
    }
  }, [postId, queryClient, enabled, callbackRef])
}

export function useSubscribeCommentIdsByPostIds(
  postIds: string[],
  enabled: boolean,
  callbackFirstResult?: (ids: string[][]) => void
) {
  const queryClient = useQueryClient()

  const lastIdInPreviousSub = useRef<Record<string, string>>({})
  const callbackRef = useWrapCallbackInRef(callbackFirstResult)

  useEffect(() => {
    const resolvers: ((value: string[] | PromiseLike<string[]>) => void)[] = []
    const promises = postIds.map((postId) => {
      return new Promise<string[]>((resolve) => {
        resolvers.push(resolve)
      })
    })

    const unsubs = postIds.map((postId, idx) => {
      return subscription(
        enabled,
        postId,
        queryClient,
        {
          get: () => lastIdInPreviousSub.current[postId],
          set: (id) => (lastIdInPreviousSub.current[postId] = id),
        },
        resolvers[idx]
      )
    })

    Promise.all(promises).then((ids) => {
      callbackRef.current?.(ids)
    })

    return () => {
      unsubs.forEach((unsub) => unsub?.then((func) => func()))
      postIds.forEach((postId) => subscribedPostIds.delete(postId))
      lastIdInPreviousSub.current = {}
    }
  }, [postIds, queryClient, enabled, callbackRef])
}

function filterOptimisticIds(
  newPosts: PostData[],
  optimisticIds: string[] | undefined
) {
  if (!optimisticIds) return

  const mutatedNewPosts = [...newPosts]
  return optimisticIds.filter((id) => {
    const idData = extractOptimisticIdData<OptimisticMessageIdData>(id)
    if (!idData) return
    const foundIndex = mutatedNewPosts.findIndex((post) => {
      return (
        post.content?.body === idData.message &&
        post.struct.ownerId === idData.address
      )
    })
    const isFound = foundIndex !== -1
    if (isFound) {
      mutatedNewPosts.splice(foundIndex, 1)
    }
    return !isFound
  })
}
