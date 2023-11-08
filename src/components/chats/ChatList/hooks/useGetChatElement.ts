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
        checkIfMessageIdIsIncluded(client, messageId, renderedMessageIds) ||
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
  }, [client, renderedMessageIds, hasMore])

  const loadMoreUntilMessageIdIsLoaded = useCallback(
    async (messageId: string) => {
      const isMessageIdIncluded = checkIfMessageIdIsIncluded(
        client,
        messageId,
        renderedIdsRef.current
      )
      if (isMessageIdIncluded) return

      await awaitableLoadMore()
      await loadMoreUntilMessageIdIsLoaded(messageId)
    },
    [client, awaitableLoadMore, renderedIdsRef]
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
      if (
        checkIfMessageIdIsIncluded(client, messageId, renderedIdsRef.current)
      ) {
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
    [
      client,
      loadMoreUntilMessageIdIsLoaded,
      renderedIdsRef,
      waitAllMessagesLoadedRef,
    ]
  )

  const getMessageElementByTime = useCallback(
    async (time: number): Promise<HTMLElement | null> => {
      const renderedIds = renderedIdsRef.current
      const oldestRenderedId = renderedIds[renderedIds.length - 1]
      const oldestMessage = getPostQuery.getQueryData(client, oldestRenderedId)
      const oldestMessageTime = oldestMessage?.struct.createdAtTime
      if (!oldestMessageTime) return null

      if (time < oldestMessageTime) {
        await awaitableLoadMore()
        return await getMessageElementByTime(time)
      }

      const { id: nearestMessageId } = getNearestMessageIdToTimeFromRenderedIds(
        client,
        renderedIds,
        time
      )
      if (!nearestMessageId) return null

      const elementId = getMessageElementId(nearestMessageId)
      await waitAllMessagesLoadedRef.current()

      const element = document.getElementById(elementId)
      return element
    },
    [client, renderedIdsRef, awaitableLoadMore, waitAllMessagesLoadedRef]
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

function checkIfMessageIdIsIncluded(
  client: QueryClient,
  messageId: string,
  messageIds: string[]
) {
  const oldestRenderedId = messageIds[messageIds.length - 1]
  const oldestMessage = getPostQuery.getQueryData(client, oldestRenderedId)
  const oldestMessageTime = oldestMessage?.struct.createdAtTime

  const messageTime = getPostQuery.getQueryData(client, messageId)?.struct
    .createdAtTime
  return oldestMessageTime && messageTime && oldestMessageTime <= messageTime
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
