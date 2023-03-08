import useWaitNewBlock from '@/hooks/useWaitNewBlock'
import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { PostData } from '@subsocial/api/types'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getPostQuery } from '../posts'
import { extractOptimisticIdData, isOptimisticId } from '../utils'
import { getCommentIdsQueryKey } from './query'
import { OptimisticMessageIdData } from './types'

const subscribedPostIds = new Set<string>()

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean,
  callbackFirstResult?: (ids: string[]) => void
) {
  const queryClient = useQueryClient()
  const waitNewBlock = useWaitNewBlock()

  const lastIdInPreviousSub = useRef('')
  const callbackRef = useRef(callbackFirstResult)
  callbackRef.current = callbackFirstResult

  useEffect(() => {
    if (!enabled || subscribedPostIds.has(postId)) return
    subscribedPostIds.add(postId)

    let unsub: Promise<() => void> = (async () => {
      const subsocialApi = await getSubsocialApi()
      const substrateApi = await subsocialApi.substrateApi

      return substrateApi.query.posts.replyIdsByPostId(postId, async (ids) => {
        const newIds = Array.from(ids.toPrimitive() as any).map((id) => id + '')
        const lastId = newIds[newIds.length - 1]
        const lastSubscribedId = lastIdInPreviousSub.current

        lastIdInPreviousSub.current = lastId

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
          callbackRef.current?.(newIds)
          return
        }

        // consecutive subscription, set data after new block
        // TODO: remove if subscription is fixed
        await waitNewBlock()
        const lastSubscribedIdIndex = newIds.findIndex(
          (id) => id === lastSubscribedId
        )
        const newIdsAfterLastSubscribed = newIds.slice(
          lastSubscribedIdIndex + 1
        )
        if (!newIdsAfterLastSubscribed.length) {
          updateQueryData()
          return
        }

        const newPosts = await subsocialApi.findPublicPosts(
          newIdsAfterLastSubscribed
        )
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

    return () => {
      unsub?.then((func) => func())
      subscribedPostIds.delete(postId)
      lastIdInPreviousSub.current = ''
    }
  }, [postId, queryClient, enabled, waitNewBlock])
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
