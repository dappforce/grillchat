import { QueryConfig } from '@/subsocial-query'
import { SpaceData } from '@subsocial/api/types'
import {
  QueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQueryClient,
} from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { GetSpacesQuery, QueryOrder } from '../generated-query'
import { mapDatahubSpaceFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'
import {
  getSpaceQuery,
  PaginatedSpacesData,
  SPACE_FRAGMENT,
  SPACE_PER_PAGE,
} from './query'

export const GET_PAGINATED_SPACES = gql`
  ${SPACE_FRAGMENT}
  query getPaginatedSpaces(
    $pageSize: Int!
    $offset: Int!
    $orderBy: String!
    $orderDirection: QueryOrder!
  ) {
    spaces(
      args: {
        filter: { hidden: false }
        pageSize: $pageSize
        offset: $offset
        orderBy: $orderBy
        orderDirection: $orderDirection
      }
    ) {
      data {
        ...SpaceFragment
      }
      total
    }
  }
`

type HomeSpacesData = {
  pageSize?: number
}

async function getHomePageSpaceIdsRaw({
  page,
  client,
  pageSize,
}: {
  page: number
  client?: QueryClient | null
  pageSize?: number
} & HomeSpacesData): Promise<PaginatedSpacesData> {
  if (!client) return { data: [], page, hasMore: false, totalData: 0 }

  const oldIds = getHomePageSpaceIds.getFirstPageData(client, { pageSize })

  const chatPerPage = SPACE_PER_PAGE
  const firstPageDataLength = oldIds?.length || chatPerPage

  const spacesPerPage = pageSize || chatPerPage

  let offset = Math.max((page - 2) * spacesPerPage + firstPageDataLength, 0)
  if (page === 1) offset = 0

  const res = await datahubQueryRequest<
    { spaces: { data: GetSpacesQuery['spaces']['data']; total: number } },
    {
      pageSize: number
      offset: number
      orderBy: string
      orderDirection: QueryOrder
    }
  >({
    document: GET_PAGINATED_SPACES,
    variables: {
      pageSize: spacesPerPage,
      offset,
      orderBy: 'createdAtTime',
      orderDirection: QueryOrder.Desc,
    },
  })
  const optimisticIds = new Set<string>()
  const ids: string[] = []
  const spaces: SpaceData[] = []
  res.spaces.data.forEach((space) => {
    optimisticIds.add('')

    const id = space.id
    ids.push(id)

    const mapped = mapDatahubSpaceFragment(space)
    spaces.push(mapped)
    getSpaceQuery.setQueryData(client, id, mapped)
  })
  const totalData = res.spaces.total ?? 0
  const hasMore = offset + ids.length < totalData

  const idsSet = new Set<string>(ids)

  let unincludedFirstPageIds: string[] = []
  if (page === 1 && oldIds) {
    let unincludedIdsIndex = oldIds.length

    let hasFoundIncludedId = false

    for (let i = oldIds.length - 1; i >= 0; i--) {
      const id = oldIds[i]

      if (hasFoundIncludedId) continue

      if (!idsSet.has(id)) {
        unincludedIdsIndex = i
      } else {
        hasFoundIncludedId = true
      }
    }

    unincludedFirstPageIds = oldIds.slice(unincludedIdsIndex)
  }

  return {
    data: [...spaces.map(({ id }) => id), ...unincludedFirstPageIds],
    page,
    hasMore,
    totalData,
  }
}

const HOME_PAGE_SPACE_IDS_QUERY_KEY = 'spaceIds'
const getPaginatedQueryKey = (data: HomeSpacesData) => [
  HOME_PAGE_SPACE_IDS_QUERY_KEY,
  data,
]
export const getHomePageSpaceIds = {
  getPaginatedQueryKey,
  getFirstPageData: (client: QueryClient, data: HomeSpacesData) => {
    const cachedData = client?.getQueryData(getPaginatedQueryKey(data))
    return ((cachedData as any)?.pages?.[0] as PaginatedSpacesData | undefined)
      ?.data
  },
  getCurrentPageNumber: (client: QueryClient, data: HomeSpacesData) => {
    const cachedData = client?.getQueryData(getPaginatedQueryKey(data))
    return (cachedData as any)?.pages?.length
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    data: HomeSpacesData,
    page = 1,
    pageSize?: number
  ) => {
    const res = await getHomePageSpaceIdsRaw({
      ...data,
      page,
      client,
      pageSize,
    })
    if (!client) return res

    client.setQueryData(getPaginatedQueryKey(data), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setQueryFirstPageData: (
    client: QueryClient,
    data: HomeSpacesData,
    updater: (oldIds?: string[]) => string[] | undefined | null
  ) => {
    client.setQueryData(getPaginatedQueryKey(data), (oldData: any) => {
      const firstPage = oldData?.pages?.[0] as PaginatedSpacesData | undefined
      const newPages = [...(oldData?.pages ?? [])]
      const newFirstPageSpaceIds = updater(firstPage?.data)
      newPages.splice(0, 1, {
        ...firstPage,
        data: newFirstPageSpaceIds,
        totalData: newFirstPageSpaceIds?.length ?? 0,
      } as PaginatedSpacesData)
      return {
        pageParams: [...(oldData?.pageParams ?? [])],
        pages: [...newPages],
      }
    })
  },
  invalidateLastQuery: (client: QueryClient, data: HomeSpacesData) => {
    client.refetchQueries(getPaginatedQueryKey(data), {
      refetchPage: (_, index, allPages) => {
        const lastPageIndex = allPages.length - 1
        if (index !== lastPageIndex) return false
        if (
          !allPages[lastPageIndex] ||
          !(allPages[lastPageIndex] as { hasMore: boolean }).hasMore
        )
          return true
        return false
      },
    })
  },
  invalidateFirstQuery: (client: QueryClient, data: HomeSpacesData) => {
    client.invalidateQueries(getPaginatedQueryKey(data), {
      refetchPage: (_, index) => index === 0,
    })
  },
  useInfiniteQuery: (
    data: HomeSpacesData,
    config?: QueryConfig
  ): UseInfiniteQueryResult<PaginatedSpacesData, unknown> => {
    const client = useQueryClient()
    return useInfiniteQuery({
      ...config,
      queryKey: getPaginatedQueryKey(data),
      queryFn: async ({ pageParam = 1, queryKey }) => {
        const res = await getHomePageSpaceIdsRaw({
          ...data,
          page: pageParam,
          client,
        })

        if (pageParam === 1) {
          client.setQueryData<{
            pageParams: number[]
            pages: PaginatedSpacesData[]
          }>(getPaginatedQueryKey(data), (oldData) => {
            if (
              !oldData ||
              !Array.isArray(oldData.pageParams) ||
              !Array.isArray(oldData.pages)
            )
              return oldData
            const pages = [...oldData.pages]
            pages.splice(0, 1, res)
            return {
              ...oldData,
              pageParams: [...oldData.pageParams],
              pages,
            }
          })
        }

        return res
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    })
  },
}
