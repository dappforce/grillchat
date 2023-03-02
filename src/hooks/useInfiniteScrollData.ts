import { useMemo, useState } from 'react'

export default function useInfiniteScrollData<Data>(
  data: Data[],
  itemsPerPage: number,
  reverse?: boolean
) {
  const [currentPage, setCurrentPage] = useState(1)

  const currentData = useMemo(() => {
    const itemCountInCurrentPage = currentPage * itemsPerPage
    let start = 0
    let end = Math.min(itemCountInCurrentPage, data.length)
    if (reverse) {
      start = Math.max(data.length - itemCountInCurrentPage - 1, 0)
      end = data.length - 1
    }
    return data.slice(start, end)
  }, [data, currentPage, itemsPerPage, reverse])

  const hasMore = currentPage * itemsPerPage < data.length

  const loadMore = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1)
    }
  }

  return { currentData, hasMore, loadMore }
}
