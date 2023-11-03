import useWrapInRef from '@/hooks/useWrapInRef'
import { getPosts } from '@/services/api/fetcher'
import { getPostQuery } from '@/services/api/query'
import { PostData } from '@subsocial/api/types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import jsonabc from 'jsonabc'
import { useEffect, useRef } from 'react'
import { getAccountDataQuery, getAccountsData } from '../evmAddresses'
import { extractOptimisticIdData, isOptimisticId } from '../utils'
import { getOptimisticContent } from './optimistic'
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
  }
) => {
  if (!enabled || subscribedPostIds.has(postId)) return
  subscribedPostIds.add(postId)

  let unsub: Promise<() => void> = (async () => {
    const { getSubsocialApi } = await import(
      '@/subsocial-query/subsocial/connection'
    )
    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const addressesSet = new Set<string>()

    return substrateApi.query.posts.replyIdsByPostId(postId, async (ids) => {
      let parsedIds: unknown[] = ids
      if (typeof ids.toPrimitive === 'function') {
        parsedIds = ids.toPrimitive() as any
      }
      const newIds = Array.from(parsedIds)
        .map((id) => id?.toString())
        .filter(Boolean)
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

      if (lastSubscribedId === undefined) {
        updateQueryData()
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
        const owner = post.struct.ownerId
        addressesSet.add(owner)
        getPostQuery.setQueryData(queryClient, post.id, post)
      })

      async function updateAccountData() {
        const accountData = await getAccountsData(Array.from(addressesSet))

        accountData.forEach((accountAddresses) => {
          getAccountDataQuery.setQueryData(
            queryClient,
            accountAddresses.grillAddress,
            accountAddresses
          )
        })
      }

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
      updateAccountData()
    })
  })()

  return unsub
}

export function useSubscribeCommentIdsByPostId(
  postId: string,
  enabled: boolean
) {
  const queryClient = useQueryClient()

  const lastIdInPreviousSub = useRef<string>()

  useEffect(() => {
    const unsub = subscription(enabled, postId, queryClient, {
      get: () => lastIdInPreviousSub.current,
      set: (id) => (lastIdInPreviousSub.current = id),
    })

    return () => {
      unsub?.then((func) => func())
      lastIdInPreviousSub.current = undefined
      if (unsub) subscribedPostIds.delete(postId)
    }
  }, [postId, queryClient, enabled])
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
    const unsubs = postIds.map((postId) => {
      return subscription(enabled, postId, queryClient, {
        get: () => lastIdInPreviousSub.current[postId],
        set: (id) => (lastIdInPreviousSub.current[postId] = id),
      })
    })

    return () => {
      lastIdInPreviousSub.current = {}
      unsubs.forEach((unsub, idx) => {
        unsub?.then((func) => func())
        if (unsub) {
          subscribedPostIds.delete(postIds[idx])
        }
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
      function sortAndStringify(data: any) {
        return JSON.stringify(jsonabc.sortObj(data ?? {}))
      }

      if (!post.content) return false

      const importantContents = getOptimisticContent(post.content)
      return (
        sortAndStringify(importantContents) ===
          sortAndStringify(idData.messageData) &&
        post.struct.ownerId === idData.address
      )
    })
    if (foundData) mutableNewPosts.splice(mutableNewPosts.indexOf(foundData), 1)

    return !foundData
  })
}
