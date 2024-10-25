import { PROPOSALS_PER_PAGE } from '@/constants/proposals'
import { QueryConfig } from '@/old/subsocial-query'
import { ApiProposalsResponse } from '@/pages/api/opengov/proposals'
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { apiInstance } from '../utils'

async function getPaginatedProposals({
  page,
  limit,
}: {
  page: number
  limit: number
}) {
  const res = await apiInstance.get('/api/opengov/proposals', {
    params: { page, limit },
  })
  const resData = res.data as ApiProposalsResponse
  return resData
}

const PROPOSALS_QUERY_KEY = 'proposals'
const getQueryKey = () => [PROPOSALS_QUERY_KEY]
export const getPaginatedProposalsQuery = {
  getQueryKey,
  fetchFirstPageQuery: async (client: QueryClient | null) => {
    const res = await getPaginatedProposals({
      page: 1,
      limit: PROPOSALS_PER_PAGE,
    })
    if (!client) return res

    client.setQueryData(getQueryKey(), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setFirstPageData: (queryClient: QueryClient, data: ApiProposalsResponse) => {
    queryClient.setQueryData(getQueryKey(), {
      pageParams: [1],
      pages: [data],
    })
  },
  useInfiniteQuery: (config?: QueryConfig) => {
    return useInfiniteQuery<
      ApiProposalsResponse,
      unknown,
      ApiProposalsResponse,
      string[]
    >({
      ...config,
      queryKey: getQueryKey(),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await getPaginatedProposals({
          page: pageParam,
          limit: PROPOSALS_PER_PAGE,
        })
        return res
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    })
  },
}
