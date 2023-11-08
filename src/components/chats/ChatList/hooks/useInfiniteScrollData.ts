import usePrevious from '@/hooks/usePrevious'
import { useMemo, useState } from 'react'
import usePauseableLoadMore from './usePausableLoadMore'

export default function useInfiniteScrollData<Data>(
  data: Data[],
  itemsPerPage: number,
  isPausedLoadMore?: boolean
) {
  const [currentPage, setCurrentPage] = useState(1)
  const previousDataLength = usePrevious(data.length)

  const currentData = useMemo(() => {
    const newData = data.length - (previousDataLength ?? data.length)
    const itemCountInCurrentPage = currentPage * itemsPerPage + newData

    let start = Math.max(data.length - itemCountInCurrentPage, 0)
    let end = data.length
    const slicedData = data.slice(start, end)

    slicedData.reverse()
    return slicedData
  }, [data, previousDataLength, currentPage, itemsPerPage])

  const hasMore = currentPage * itemsPerPage < data.length

  const loadMore = usePauseableLoadMore(() => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, isPausedLoadMore)

  return { currentData, hasMore, loadMore, currentPage }
}
