import useWrapInRef from '@/hooks/useWrapInRef'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { useCallback, useEffect, useRef } from 'react'

export default function usePauseableLoadMore(
  loadMore: () => void,
  isPausedLoadMore?: boolean
) {
  const callResolvers = useRef<VoidFunction[]>([])
  useEffect(() => {
    if (!isPausedLoadMore) {
      callResolvers.current.forEach((resolver) => resolver())
      callResolvers.current = []
    }
  }, [isPausedLoadMore])

  const loadMoreRef = useWrapInRef(loadMore)
  const pauseableLoadMore = useCallback(async () => {
    if (isPausedLoadMore) {
      const { getPromise, getResolver } = generateManuallyTriggeredPromise()
      callResolvers.current.push(getResolver())
      await getPromise()
    }

    loadMoreRef.current()
  }, [loadMoreRef, isPausedLoadMore])

  return pauseableLoadMore
}
