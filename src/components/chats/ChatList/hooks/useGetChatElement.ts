import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { getMessageElementId } from '../../utils'

// TODO: refactor this hook to have better readability
export default function useGetMessageElement({
  loadMore,
  isLoading,
  renderedMessageIds,
  hasMore,
}: {
  renderedMessageIds: string[]
  isLoading: boolean
  loadMore: () => void
  hasMore: boolean
}) {
  const client = useQueryClient()
  const waitAllMessagesLoaded = useWaitMessagesLoading(isLoading)

  const waitAllMessagesLoadedRef = useWrapInRef(waitAllMessagesLoaded)
  const renderedIdsRef = useWrapInRef(renderedMessageIds)

  const promiseRef = useRef<{
    resolvers: Map<string, VoidFunction[]>
    waitingMessageDataLoadedIds: Set<string>
  }>({ resolvers: new Map(), waitingMessageDataLoadedIds: new Set() })

  const awaitableLoadMore = useAwaitableLoadMore(
    loadMore,
    renderedMessageIds.length
  )

  useEffect(() => {
    const { waitingMessageDataLoadedIds, resolvers: allIdsResolver } =
      promiseRef.current

    waitingMessageDataLoadedIds.forEach((messageId) => {
      if (
        checkIfMessageIdIsIncluded(messageId, renderedMessageIds) ||
        !hasMore
      ) {
        const resolvers = promiseRef.current.resolvers.get(messageId)
        resolvers?.forEach((resolve) => resolve())

        promiseRef.current.resolvers.delete(messageId)
        waitingMessageDataLoadedIds.delete(messageId)
      }
    })

    return () => {
      allIdsResolver.forEach((resolvers) => {
        resolvers.forEach((resolve) => resolve())
      })
    }
  }, [renderedMessageIds, hasMore])

  const loadMoreUntilMessageIdIsLoaded = useCallback(
    async (messageId: string) => {
      const isMessageIdIncluded = checkIfMessageIdIsIncluded(
        messageId,
        renderedIdsRef.current
      )
      if (isMessageIdIncluded) return

      await awaitableLoadMore()
      await loadMoreUntilMessageIdIsLoaded(messageId)
    },
    [awaitableLoadMore, renderedIdsRef]
  )

  const getMessageElementById = useCallback(
    async (messageId: string) => {
      const {
        getPromise: getMessageDataLoadedPromise,
        getResolver: getMessageDataLoadedResolver,
      } = generateManuallyTriggeredPromise()
      const elementId = getMessageElementId(messageId)
      const element = document.getElementById(elementId)

      // check if element is already rendered
      if (element) return element

      // load more until message id is included in current page
      await loadMoreUntilMessageIdIsLoaded(messageId)

      // if its already rendered, get and return it
      if (checkIfMessageIdIsIncluded(messageId, renderedIdsRef.current)) {
        return document.getElementById(elementId)
      }

      // if not rendered yet, create a promise and wait for it to be rendered
      const { resolvers, waitingMessageDataLoadedIds: waitingMessageIds } =
        promiseRef.current
      if (!resolvers.get(messageId)) {
        resolvers.set(messageId, [])
      }
      resolvers.get(messageId)?.push(getMessageDataLoadedResolver())
      waitingMessageIds.add(messageId)

      await getMessageDataLoadedPromise()
      await waitAllMessagesLoadedRef.current()

      return document.getElementById(elementId)
    },
    [loadMoreUntilMessageIdIsLoaded, renderedIdsRef, waitAllMessagesLoadedRef]
  )

  const getMessageElementByTime = useCallback(
    async (time: number) => {
      const renderedIds = renderedIdsRef.current
      const oldestRenderedId = renderedIds[renderedIds.length - 1]
      const oldestMessage = getPostQuery.getQueryData(client, oldestRenderedId)
      const oldestMessageTime = oldestMessage?.struct.createdAtTime
      if (!oldestMessageTime) return

      if (time < oldestMessageTime) {
        await awaitableLoadMore()
        getMessageElementByTime(time)
        return
      }

      const { id: nearestMessageId } = getNearestMessageIdToTimeFromRenderedIds(
        client,
        renderedIds,
        time
      )
      if (!nearestMessageId) return

      const elementId = getMessageElementId(nearestMessageId)
      const element = document.getElementById(elementId)
      return element
    },
    [client, renderedIdsRef, awaitableLoadMore]
  )

  const getMessageElement = useCallback(
    (messageIdOrTime: string | number) => {
      if (typeof messageIdOrTime === 'string') {
        return getMessageElementById(messageIdOrTime)
      } else {
        return getMessageElementByTime(messageIdOrTime)
      }
    },
    [getMessageElementById, getMessageElementByTime]
  )

  return getMessageElement
}

function useAwaitableLoadMore(
  loadMore: () => void,
  loadedMessagesCount: number
) {
  const resolverRef = useRef<VoidFunction[]>([])

  useEffect(() => {
    const resolvers = resolverRef.current
    resolvers.forEach((resolve) => resolve())
    resolverRef.current = []
  }, [loadedMessagesCount])

  const loadMoreRef = useWrapInRef(loadMore)
  return useCallback(async () => {
    const { getResolver, getPromise } = generateManuallyTriggeredPromise()
    loadMoreRef.current()
    resolverRef.current.push(getResolver())
    await getPromise()
  }, [loadMoreRef])
}

function useWaitMessagesLoading(isLoading: boolean) {
  const resolverRef = useRef<VoidFunction[]>([])

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

function checkIfMessageIdIsIncluded(messageId: string, messageIds: string[]) {
  const parsedMessageId = Number(messageId)
  if (isNaN(parsedMessageId)) return true

  const smallestId = Number(messageIds[messageIds.length - 1])
  return parsedMessageId >= smallestId
}

export function getNearestMessageIdToTimeFromRenderedIds(
  queryClient: QueryClient,
  renderedIds: string[],
  time: number
) {
  let nearestMessageId: string | null = null
  let nearestMessageIndex = -1
  for (let i = renderedIds.length - 1; i >= 0; i--) {
    const currentMessage = getPostQuery.getQueryData(
      queryClient,
      renderedIds[i]
    )
    if (!currentMessage) continue

    const messageTime = currentMessage.struct.createdAtTime
    if (messageTime >= time) {
      nearestMessageId = renderedIds[i]
      nearestMessageIndex = i
      break
    }
  }
  return { id: nearestMessageId, index: nearestMessageIndex }
}
