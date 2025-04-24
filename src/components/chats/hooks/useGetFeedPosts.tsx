import { getFeedPostIds } from '@/services/datahub/posts/feedQuery'
import { PaginatedPostsData } from '@/services/datahub/posts/query'
import { useMemo } from 'react'

type PaginatedData = {
  spaceIds: string[]
  currentPage: number
  loadMore: () => void
  hasMore: boolean
  totalDataCount: number
  isLoading: boolean
  refetch?: () => void
  isSuccess?: boolean
  isError?: boolean
  isFetching?: boolean
}

type PaginatedConfig = {
  pageSize?: number
  address: string
}

export default function useGetFeedPostIds({
  address,
  pageSize,
}: PaginatedConfig): PaginatedData {
  const { data: placeholderData } = getFeedPostIds.useInfiniteQuery(
    {
      address,
      pageSize,
    },
    {
      enabled: false,
    }
  )
  const {
    data,
    fetchNextPage,
    isLoading,
    refetch,
    isSuccess,
    isError,
    isFetching,
  } = getFeedPostIds.useInfiniteQuery(
    {
      address,
      pageSize,
    },
    { placeholderData }
  )

  const page = data?.pages
  let lastPage: PaginatedPostsData | null = null
  if (page && page.length > 0) {
    const last = page[page.length - 1]
    if (last) {
      lastPage = last
    }
  }

  const flattenedIds = useMemo(() => {
    return Array.from(
      new Set(data?.pages?.map((page) => page.data).flat() || [])
    )
  }, [data?.pages])

  return {
    currentPage: lastPage?.page ?? 1,
    spaceIds: flattenedIds,
    loadMore: fetchNextPage,
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore ?? true,
    isLoading,
    refetch: () => refetch(),
    isSuccess,
    isError,
    isFetching,
  }
}
