import useWrapInRef from '@/hooks/useWrapInRef'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { useCallback, useEffect, useRef } from 'react'
import { getMessageElementId } from '../../utils'

// TODO: refactor this hook to have better readability
export default function useGetMessageElement({
  messageIds,
  loadMore,
  isLoading,
  renderedMessageIds,
}: {
  messageIds: string[]
  renderedMessageIds: string[]
  isLoading: boolean
  loadMore: () => void
}) {
  const waitAllMessagesLoaded = useWaitMessagesLoading(isLoading)

  const waitAllMessagesLoadedRef = useWrapInRef(waitAllMessagesLoaded)
  const messageIdsRef = useWrapInRef(messageIds)

  const promiseRef = useRef<{
    resolvers: Map<string, VoidFunction[]>
    waitingMessageDataLoadedIds: Set<string>
  }>({ resolvers: new Map(), waitingMessageDataLoadedIds: new Set() })

  const awaitableLoadMore = useAwaitableLoadMore(
    loadMore,
    renderedMessageIds.length
  )

  useEffect(() => {
    const { waitingMessageDataLoadedIds } = promiseRef.current

    waitingMessageDataLoadedIds.forEach((messageId) => {
      if (renderedMessageIds.includes(messageId)) {
        const resolvers = promiseRef.current.resolvers.get(messageId)
        resolvers?.forEach((resolve) => resolve())

        promiseRef.current.resolvers.delete(messageId)
        waitingMessageDataLoadedIds.delete(messageId)
      }
    })
  }, [renderedMessageIds])

  const loadMoreUntilMessageIdIsLoaded = useCallback(
    async (messageId: string) => {
      const isMessageIdIncluded = messageIdsRef.current.includes(messageId)
      console.log('messageid included', isMessageIdIncluded)
      if (isMessageIdIncluded) return

      await awaitableLoadMore()
      await loadMoreUntilMessageIdIsLoaded(messageId)
    },
    [awaitableLoadMore, messageIdsRef]
  )

  const getMessageElement = useCallback(
    async (messageId: string) => {
      const messageIds = messageIdsRef.current
      const {
        getPromise: getMessageDataLoadedPromise,
        getResolver: getMessageDataLoadedResolver,
      } = generateManuallyTriggeredPromise()
      const elementId = getMessageElementId(messageId)
      const element = document.getElementById(elementId)
      if (element) return element

      const { resolvers, waitingMessageDataLoadedIds: waitingMessageIds } =
        promiseRef.current

      if (!resolvers.get(messageId)) {
        resolvers.set(messageId, [])
      }
      resolvers.get(messageId)?.push(getMessageDataLoadedResolver())
      waitingMessageIds.add(messageId)

      const isMessageIdIncluded = messageIds.includes(messageId)
      if (!isMessageIdIncluded) {
        await loadMoreUntilMessageIdIsLoaded(messageId)
      }

      await getMessageDataLoadedPromise()
      await waitAllMessagesLoadedRef.current()

      return document.getElementById(elementId)
    },
    [loadMoreUntilMessageIdIsLoaded, messageIdsRef, waitAllMessagesLoadedRef]
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
