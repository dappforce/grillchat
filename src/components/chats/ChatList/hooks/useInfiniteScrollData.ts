import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import usePrevious from '../../../../hooks/usePrevious'

export default function useInfiniteScrollData<Data>(
  data: Data[],
  itemsPerPage: number,
  isPausedLoadMore?: boolean
) {
  const [currentPage, setCurrentPage] = useState(1)
  const previousDataLength = usePrevious(data.length)

  const callResolvers = useRef<VoidFunction[]>([])
  useEffect(() => {
    if (!isPausedLoadMore) {
      callResolvers.current.forEach((resolver) => resolver())
      callResolvers.current = []
    }
  }, [isPausedLoadMore])

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

  const loadMore = useCallback(async () => {
    console.log('Load more...')

    if (isPausedLoadMore) {
      const { getPromise, getResolver } = generateManuallyTriggeredPromise()
      callResolvers.current.push(getResolver())
      await getPromise()
    }

    if (hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasMore, isPausedLoadMore])

  return { currentData, hasMore, loadMore }
}
