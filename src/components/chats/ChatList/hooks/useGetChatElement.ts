import useWrapInRef from '@/hooks/useWrapInRef'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
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
      const isMessageIdIncluded = renderedIdsRef.current.includes(messageId)
      if (isMessageIdIncluded) return

      await awaitableLoadMore()
      await loadMoreUntilMessageIdIsLoaded(messageId)
    },
    [awaitableLoadMore, renderedIdsRef]
  )

  const getMessageElement = useCallback(
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
  console.log(messageId, messageIds)
  const parsedMessageId = Number(messageId)
  if (isNaN(parsedMessageId)) return true

  const smallestId = Number(messageIds[messageIds.length - 1])
  return parsedMessageId >= smallestId
}
