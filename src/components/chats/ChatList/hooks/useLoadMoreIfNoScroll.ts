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
  useEffect(() => {
    const inner = innerContainer.current
    const scroll = scrollContainer.current
    if (inner && scroll) {
      const innerHeight = inner.clientHeight
      const scrollContainerHeight = scroll.scrollHeight
      if (innerHeight < scrollContainerHeight) {
        loadMore()
      }
    }
  }, [loadedItemLength, loadMore, scrollContainer, innerContainer])
}
