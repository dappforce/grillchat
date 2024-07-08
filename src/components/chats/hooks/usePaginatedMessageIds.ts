import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import {
  PaginatedPostsData,
  getPaginatedPostIdsByPostId,
} from '@/services/datahub/posts/query'
import { useMemo } from 'react'

type PaginatedData = {
  messageIds: string[]
  currentPage: number
  loadMore: () => void
  hasMore: boolean
  totalDataCount: number
  isLoading: boolean
  allIds: string[]
}

type PaginatedConfig = {
  hubId: string
  chatId: string
  onlyDisplayUnapprovedMessages?: boolean
}

export default function usePaginatedMessageIds({
  chatId,
  hubId,
  onlyDisplayUnapprovedMessages,
}: PaginatedConfig): PaginatedData {
  const { data, fetchNextPage, isLoading } =
    getPaginatedPostIdsByPostId.useInfiniteQuery({
      postId: chatId,
      onlyDisplayUnapprovedMessages: !!onlyDisplayUnapprovedMessages,
    })

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

  const filteredPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    flattenedIds
  )

  return {
    currentPage: lastPage?.page ?? 1,
    messageIds: filteredPageIds,
    loadMore: fetchNextPage,
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore ?? true,
    isLoading,
    allIds: filteredPageIds,
  }
}
