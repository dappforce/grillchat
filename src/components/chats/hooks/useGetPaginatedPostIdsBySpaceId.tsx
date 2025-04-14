import {
  getPaginatedPostIdsBySpaceId,
  PaginatedPostsData,
} from '@/services/datahub/posts/query'
import { useMemo } from 'react'

type PaginatedData = {
  postIds: string[]
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
  spaceId: string
  pageSize?: number
}

export default function usePaginatedPostIdsBySpaceId({
  spaceId,
  pageSize,
}: PaginatedConfig): PaginatedData {
  const { data: placeholderData } =
    getPaginatedPostIdsBySpaceId.useInfiniteQuery(
      {
        spaceId,
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
  } = getPaginatedPostIdsBySpaceId.useInfiniteQuery(
    {
      spaceId,
      pageSize,
    },
    { enabled: !!spaceId, placeholderData }
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
    postIds: flattenedIds,
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
