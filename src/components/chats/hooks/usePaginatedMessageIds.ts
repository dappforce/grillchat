import { CHAT_PER_PAGE } from '@/constants/chat'
import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import {
  getPaginatedPostsByPostIdFromDatahubQuery,
  PaginatedPostsData,
} from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'
import { useMemo } from 'react'
import useInfiniteScrollData from '../ChatList/hooks/useInfiniteScrollData'

type PaginatedData = {
  currentPageMessageIds: string[]
  currentPage: number
  loadMore: () => void
  hasMore: boolean
  totalDataCount: number
}

type PaginatedConfig = {
  isPausedLoadMore?: boolean
  hubId: string
  chatId: string
}

export default function usePaginatedMessageIds(config: PaginatedConfig) {
  return getDatahubConfig()
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
  const { data, fetchNextPage } =
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

  return {
    currentPage: lastPage?.page ?? 1,
    currentPageMessageIds: filteredCurrentPageIds,
    loadMore: () => {
      console.trace('masuk')
      fetchNextPage()
    },
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore || true,
  }
}

export function usePaginatedMessageIdsFromChain({
  chatId,
  hubId,
  isPausedLoadMore,
}: PaginatedConfig): PaginatedData {
  const { data: rawMessageIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      subscribe: true,
    }
  )
  const messageIds = rawMessageIds || EMPTY_ARRAY

  const {
    currentPage,
    currentData: currentPageMessageIds,
    loadMore,
    hasMore,
  } = useInfiniteScrollData(messageIds, CHAT_PER_PAGE, isPausedLoadMore)

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
  }
}