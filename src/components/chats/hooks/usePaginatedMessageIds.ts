import useFilterBlockedMessageIds from '@/hooks/useFilterBlockedMessageIds'
import {
  PaginatedPostsData,
  getPaginatedPostIdsByPostId,
} from '@/services/datahub/posts/query'
import { getPaginatedPostIdsByPostIdAndAccount } from '@/services/datahub/posts/queryByAccount'
import { useMyMainAddress } from '@/stores/my-account'
import { useMemo } from 'react'

type PaginatedData = {
  messageIds: string[]
  unfilteredMessageIds: string[]
  currentPage: number
  loadMore: () => void
  hasMore: boolean
  totalDataCount: number
  isLoading: boolean
  allIds: string[]
  refetch?: () => void
  isSuccess?: boolean
  isError?: boolean
  isFetching?: boolean
}

type PaginatedConfig = {
  hubId: string
  chatId: string
  onlyDisplayUnapprovedMessages?: boolean
  pageSize?: number
}

export default function usePaginatedMessageIds({
  chatId,
  hubId,
  onlyDisplayUnapprovedMessages,
  pageSize,
}: PaginatedConfig): PaginatedData {
  const myAddress = useMyMainAddress() ?? ''
  // because from server it doesn't have access to myAddress, so we need to use the data without users' unapproved posts as placeholder
  const { data: placeholderData } =
    getPaginatedPostIdsByPostId.useInfiniteQuery(
      {
        postId: chatId,
        onlyDisplayUnapprovedMessages: !!onlyDisplayUnapprovedMessages,
        myAddress: '',
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
  } = getPaginatedPostIdsByPostId.useInfiniteQuery(
    {
      postId: chatId,
      onlyDisplayUnapprovedMessages: !!onlyDisplayUnapprovedMessages,
      myAddress,
      pageSize,
    },
    { enabled: !!myAddress, placeholderData }
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

  const filteredPageIds = useFilterBlockedMessageIds(
    hubId,
    chatId,
    flattenedIds
  )

  return {
    currentPage: lastPage?.page ?? 1,
    messageIds: filteredPageIds,
    unfilteredMessageIds: flattenedIds,
    loadMore: fetchNextPage,
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore ?? true,
    isLoading,
    allIds: filteredPageIds,
    refetch: () => refetch(),
    isSuccess,
    isError,
    isFetching,
  }
}

type PaginatedByAccountConfig = PaginatedConfig & {
  account: string
  isModerator: boolean
}

export function usePaginatedMessageIdsByAccount({
  account,
  chatId,
  hubId,
  isModerator,
}: PaginatedByAccountConfig): PaginatedData {
  const { data, fetchNextPage, isLoading } =
    getPaginatedPostIdsByPostIdAndAccount.useInfiniteQuery(chatId, account)

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

  return {
    currentPage: lastPage?.page ?? 1,
    messageIds: isModerator ? flattenedIds : filteredPageIds,
    loadMore: fetchNextPage,
    totalDataCount: data?.pages?.[0].totalData || 0,
    hasMore: lastPage?.hasMore ?? true,
    unfilteredMessageIds: flattenedIds,
    isLoading,
    allIds: isModerator ? flattenedIds : filteredPageIds,
  }
}
