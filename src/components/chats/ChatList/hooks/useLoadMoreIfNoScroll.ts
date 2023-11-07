import useWrapInRef from '@/hooks/useWrapInRef'
import { useEffect } from 'react'

export default function useLoadMoreIfNoScroll(
  loadMore: () => void,
  loadedItemLength: number,
  refs: {
    scrollContainer: React.RefObject<HTMLDivElement | null>
    innerContainer: React.RefObject<HTMLDivElement | null>
  }
) {
  const { innerContainer, scrollContainer } = refs
  const loadMoreRef = useWrapInRef(loadMore)
  useEffect(() => {
    const inner = innerContainer.current
    const scroll = scrollContainer.current
    if (inner && scroll) {
      const innerHeight = inner.clientHeight
      const scrollContainerHeight = scroll.scrollHeight
      if (innerHeight < scrollContainerHeight) {
        loadMoreRef.current()
      }
    }
  }, [loadedItemLength, loadMoreRef, scrollContainer, innerContainer])
}
