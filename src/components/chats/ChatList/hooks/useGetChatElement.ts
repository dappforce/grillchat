import useWrapCallbackInRef from '@/hooks/useWrapCallbackInRef'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { PostData } from '@subsocial/api/types'
import { UseQueryResult } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { getChatItemId } from '../helpers'

export default function useGetChatElement(
  commentIds: string[],
  commentsQuery: UseQueryResult<PostData | null, unknown>[],
  loadedCommentsQuery: UseQueryResult<PostData | null, unknown>[],
  loadMore: () => void
) {
  const waitAllCommentsLoaded = useWaitCommentsLoading(commentsQuery)
  const commentIdsRef = useWrapCallbackInRef(commentIds)

  const promiseRef = useRef<{
    resolvers: Map<string, VoidFunction[]>
    waitingCommentIds: Set<string>
  }>({ resolvers: new Map(), waitingCommentIds: new Set() })

  const loadedCommentIds = useMemo(() => {
    const ids: string[] = []
    loadedCommentsQuery.forEach((comment) => {
      if (comment.data?.id) {
        ids.push(comment.data.id)
      }
    })
    return ids
  }, [loadedCommentsQuery])

  const awaitableLoadMore = useAwaitableLoadMore(
    loadMore,
    loadedCommentIds.length
  )

  useEffect(() => {
    const { waitingCommentIds } = promiseRef.current
    waitingCommentIds.forEach((commentId) => {
      if (loadedCommentIds.includes(commentId)) {
        const resolvers = promiseRef.current.resolvers.get(commentId)
        resolvers?.forEach((resolve) => resolve())
        promiseRef.current.resolvers.delete(commentId)
        waitingCommentIds.delete(commentId)
      }
    })
  }, [loadedCommentIds])

  const loadMoreUntilCommentIsLoaded = async (commentId: string) => {
    const isCommentIdIncluded = commentIdsRef.current.includes(commentId)
    if (isCommentIdIncluded) return
    await awaitableLoadMore()
    await loadMoreUntilCommentIsLoaded(commentId)
  }

  const getChatElement = async (commentId: string) => {
    const { getPromise, getResolver } = generateManuallyTriggeredPromise()
    const elementId = getChatItemId(commentId)
    const element = document.getElementById(elementId)
    if (element) return element

    const isCommentIdIncluded = commentIds.includes(commentId)
    if (!isCommentIdIncluded) {
      await loadMoreUntilCommentIsLoaded(commentId)
    }
    const { resolvers, waitingCommentIds } = promiseRef.current
    if (!resolvers.get(commentId)) {
      resolvers.set(commentId, [])
    }
    resolvers.get(commentId)?.push(getResolver())
    waitingCommentIds.add(commentId)
    await getPromise()
    await new Promise<void>((resolve) =>
      setTimeout(async () => {
        await waitAllCommentsLoaded()
        resolve()
      })
    )

    return document.getElementById(elementId)
  }

  return getChatElement
}

function useAwaitableLoadMore(
  loadMore: () => void,
  loadedCommentsCount: number
) {
  const resolverRef = useRef<VoidFunction[]>([])

  useEffect(() => {
    const resolvers = resolverRef.current
    resolvers.forEach((resolve) => resolve())
    resolverRef.current = []
  }, [loadedCommentsCount])

  return async () => {
    const { getResolver, getPromise } = generateManuallyTriggeredPromise()
    loadMore()
    resolverRef.current.push(getResolver())
    await getPromise()
  }
}

function useWaitCommentsLoading(
  commentsQuery: UseQueryResult<PostData | null, unknown>[]
) {
  const resolverRef = useRef<VoidFunction[]>([])
  const isLoading = useIsAnyQueriesLoading(commentsQuery)

  useEffect(() => {
    if (!isLoading) {
      const resolvers = resolverRef.current
      resolvers.forEach((resolve) => resolve())
      resolverRef.current = []
    }
  }, [isLoading])

  return async () => {
    const { getResolver, getPromise } = generateManuallyTriggeredPromise()
    resolverRef.current.push(getResolver())
    if (isLoading) {
      await getPromise()
    }
  }
}
