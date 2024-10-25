import { CHAT_PER_PAGE } from '@/constants/chat'
import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import {
  getPaginatedPostsByPostIdFromDatahubQuery,
  PaginatedPostsData,
} from '@/old/services/datahub/posts/query'
import { isDatahubAvailable } from '@/old/services/datahub/utils'
import { getCommentIdsByPostIdFromChainQuery } from '@/old/services/subsocial/commentIds'
import { useMemo } from 'react'
import useInfiniteScrollData from '../ChatList/hooks/useInfiniteScrollData'
import usePauseableLoadMore from '../ChatList/hooks/usePausableLoadMore'

type PaginatedData = {
  currentPageMessageIds: string[]
  currentPage: number
  loadMore: () => void
  hasMore: boolean
  totalDataCount: number
  isLoading: boolean
  allIds: string[]
}

type PaginatedConfig = {
  isPausedLoadMore?: boolean
  hubId: string
  chatId: string
}

export default function usePaginatedMessageIds(config: PaginatedConfig) {
  return isDatahubAvailable
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      usePaginatedMessageIdsFromDatahub(config)
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      usePaginatedMessageIdsFromChain(config)
}

const EMPTY_ARRAY: string[] = []

export function usePaginatedMessageIdsFromDatahub({
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

  const filteredPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    flattenedIds
  )

  const loadMore = usePauseableLoadMore(fetchNextPage, isPausedLoadMore)

  return {
    currentPage: lastPage?.page ?? 1,
    currentPageMessageIds: filteredPageIds,
    loadMore,
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore ?? true,
    isLoading,
    allIds: filteredPageIds,
  }
}

export function usePaginatedMessageIdsFromChain({
  chatId,
  hubId,
  isPausedLoadMore,
}: PaginatedConfig): PaginatedData {
  const { data: rawMessageIds, isLoading } =
    getCommentIdsByPostIdFromChainQuery.useQuery(chatId, {
      subscribe: true,
    })
  const messageIds = rawMessageIds || EMPTY_ARRAY

  const {
    currentPage,
    currentData: currentPageMessageIds,
    loadMore,
    hasMore,
  } = useInfiniteScrollData(messageIds, CHAT_PER_PAGE, isPausedLoadMore)

  // TODO: improve this when datahub is integrated with moderation
  const filteredMessageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    messageIds
  )
  const filteredCurrentPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    currentPageMessageIds
  )

  return {
    currentPageMessageIds: filteredCurrentPageIds,
    currentPage,
    loadMore,
    hasMore,
    totalDataCount: filteredMessageIds.length,
    isLoading,
    allIds: filteredMessageIds,
  }
}
