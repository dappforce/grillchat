import useWrapInRef from '@/hooks/useWrapInRef'
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
    set: (id: string | undefined) => void
  },
  callback?: (ids: string[]) => void
) => {
  if (!enabled || subscribedPostIds.has(postId)) return
  subscribedPostIds.add(postId)

  let unsub: Promise<() => void> = (async () => {
    const { getSubsocialApi } = await import('@/utils/subsocial')
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi

    return substrateApi.query.posts.replyIdsByPostId(postId, async (ids) => {
      const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
      const lastId = newIds[newIds.length - 1] ?? ''
      const lastSubscribedId = lastIdInPreviousSub.get()

      lastIdInPreviousSub.set(lastId)

      function updateQueryData() {
        // order the ids, so that the optimistic ids are at the end
        queryClient.setQueryData<string[]>(
          getCommentIdsQueryKey(postId),
          (oldIds) => {
            const optimisticIds = oldIds?.filter((id) => isOptimisticId(id))
            return [...newIds, ...(optimisticIds ?? [])]
          }
        )
      }

      // first subscription, set data immediately
      if (lastSubscribedId === undefined) {
        updateQueryData()
        callback?.(newIds)
        return
      }

      // consecutive subscription, find new ids
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

  const lastIdInPreviousSub = useRef<string>()
  const callbackRef = useWrapInRef(callbackFirstResult)

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
      lastIdInPreviousSub.current = undefined
      if (unsub) subscribedPostIds.delete(postId)
    }
  }, [postId, queryClient, enabled, callbackRef])
}

export function useSubscribeCommentIdsByPostIds(
  postIds: string[],
  enabled: boolean,
  callbackFirstResult?: (ids: string[][]) => void
) {
  const queryClient = useQueryClient()

  const lastIdInPreviousSub = useRef<Record<string, string | undefined>>({})
  const callbackRef = useWrapInRef(callbackFirstResult)

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
      lastIdInPreviousSub.current = {}
      unsubs.forEach((unsub, idx) => {
        unsub?.then((func) => func())
        if (unsub) subscribedPostIds.delete(postIds[idx])
      })
    }
  }, [postIds, queryClient, enabled, callbackRef])
}

function filterOptimisticIds(
  newPosts: PostData[],
  optimisticIds: string[] | undefined
) {
  if (!optimisticIds) return

  // remove post if its already replacing one optimistic ids
  // this is needed for case where same user sends multiple same messages
  const mutableNewPosts = [...newPosts]
  return optimisticIds.filter((id) => {
    const idData = extractOptimisticIdData<OptimisticMessageIdData>(id)
    if (!idData) return

    const foundData = mutableNewPosts.find((post) => {
      return (
        post.content?.body === idData.message &&
        post.struct.ownerId === idData.address
      )
    })
    if (foundData) mutableNewPosts.splice(mutableNewPosts.indexOf(foundData), 1)

    return !foundData
  })
}
