import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import {
  getPaginatedPostsByPostIdFromDatahubQuery,
  PaginatedPostsData,
} from '@/services/datahub/posts/query'
import { useMemo } from 'react'
import usePauseableLoadMore from '../ChatList/hooks/usePausableLoadMore'

type PaginatedData = {
  currentPageMessageIds: string[]
  currentPage: number
  loadMore: () => void
  hasMore: boolean
  totalDataCount: number
  isLoading: boolean
}

type PaginatedConfig = {
  isPausedLoadMore?: boolean
  hubId: string
  chatId: string
}

export default function usePaginatedMessageIds({
  chatId,
  hubId,
  isPausedLoadMore,
}: PaginatedConfig): PaginatedData {
  const { data, fetchNextPage, isLoading } =
    getPaginatedPostsByPostIdFromDatahubQuery.useInfiniteQuery(chatId)

  const page = data?.pages
  let lastPage: PaginatedPostsData | null = null
  if (page && page.length > 0) {
    const last = page[page.length - 1]
    if (last) {
      lastPage = last
    }
  }

  const flattenedIds = useMemo(() => {
    return data?.pages?.map((page) => page.data).flat() || []
  }, [data?.pages])

  const filteredCurrentPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    flattenedIds
  )

  const loadMore = usePauseableLoadMore(fetchNextPage, isPausedLoadMore)

  return {
    currentPage: lastPage?.page ?? 1,
    currentPageMessageIds: filteredCurrentPageIds,
    loadMore,
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore ?? true,
    isLoading,
  }
}
