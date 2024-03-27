import { ApiProposalsResponse } from '@/pages/api/opengov/proposals'
import { QueryConfig } from '@/subsocial-query'
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { apiInstance } from '../utils'

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

async function getPaginatedProposals({
  page,
  limit,
}: {
  page: number
  limit: number
}) {
  const res = await apiInstance.get('/opengov/proposals', {
    params: { page, limit },
  })
  const resData = res.data as ApiProposalsResponse
  return resData
}

const PROPOSAL_LIMIT_PER_PAGE = 15
const PROPOSALS_QUERY_KEY = 'proposals'
const getQueryKey = () => [PROPOSALS_QUERY_KEY]
export const getPaginatedProposalsQuery = {
  getQueryKey,
  fetchFirstPageQuery: async (client: QueryClient | null) => {
    const res = await getPaginatedProposals({
      page: 1,
      limit: PROPOSAL_LIMIT_PER_PAGE,
    })
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
        const res = await getPaginatedProposals({
          page: pageParam,
          limit: PROPOSAL_LIMIT_PER_PAGE,
        })
        return res
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    })
  },
}
