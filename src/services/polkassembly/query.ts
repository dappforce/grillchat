import { QueryConfig } from '@/subsocial-query'
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { polkassemblyApi } from './utils'

interface Proposal {
  post_id: number
  title: string
}

export type PaginatedProposals = {
  data: Proposal[]
  page: number
  hasMore: boolean
  totalData: number
}
const LIMIT_PER_PAGE = 15
async function getPaginatedProposals({
  page = 1,
}: {
  page: number
}): Promise<PaginatedProposals> {
  const res = await polkassemblyApi.get('/listing/on-chain-posts', {
    params: {
      page,
      listingLimit: LIMIT_PER_PAGE,
      proposalType: 'referendums_v2',
      trackStatus: 'All',
      sortBy: 'newest',
    },
  })
  const resData = res.data as { count: number; posts: Proposal[] }

  const hasMore = page * LIMIT_PER_PAGE < resData.count
  return {
    data: resData.posts,
    page,
    hasMore,
    totalData: resData.count,
  }
}
const PROPOSALS_QUERY_KEY = 'proposals'
const getQueryKey = () => [PROPOSALS_QUERY_KEY]
export const getPaginatedProposalsQuery = {
  getQueryKey,
  fetchFirstPageQuery: async (client: QueryClient | null, page = 1) => {
    const res = await getPaginatedProposals({ page })
    if (!client) return res

    client.setQueryData(getQueryKey(), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  useInfiniteQuery: (config?: QueryConfig) => {
    return useInfiniteQuery<
      PaginatedProposals,
      unknown,
      PaginatedProposals,
      string[]
    >({
      ...config,
      queryKey: getQueryKey(),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await getPaginatedProposals({ page: pageParam })
        return res
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    })
  },
}
