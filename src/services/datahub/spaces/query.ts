import { createQuery, poolQuery, QueryConfig } from '@/subsocial-query'
import { SpaceData } from '@subsocial/api/types'
import {
  QueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQueryClient,
} from '@tanstack/react-query'
import { gql } from 'graphql-request'
import {
  GetSpacesQuery,
  GetSpacesQueryVariables,
  QueryOrder,
} from '../generated-query'
import { mapDatahubSpaceFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'

export const SPACE_PER_PAGE = 10

const SPACE_FRAGMENT = gql`
  fragment SpaceFragment on Space {
    name
    image
    about
    id
    hidden
    about
    content
    createdByAccount {
      id
    }
    ownedByAccount {
      id
    }
    createdAtTime
    createdAtBlock
  }
`
export const GET_SPACES = gql`
  ${SPACE_FRAGMENT}
  query getSpaces($ids: [String!]) {
    spaces(args: { filter: { ids: $ids } }) {
      data {
        ...SpaceFragment
      }
    }
  }
`

export const GET_SPACES_BY_OWNER = gql`
  ${SPACE_FRAGMENT}
  query getSpaces($owner: String!) {
    spaces(args: { filter: { ownedByAccountAddress: $owner } }) {
      data {
        ...SpaceFragment
      }
    }
  }
`

export const GET_PAGINATED_SPACES_BY_OWNER = gql`
  ${SPACE_FRAGMENT}
  query getSpaces(
    $owner: String!
    $pageSize: Int!
    $offset: Int!
    $orderBy: String!
    $orderDirection: QueryOrder!
  ) {
    spaces(
      args: {
        filter: { ownedByAccountAddress: $owner }
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

const getSpaces = poolQuery<string, SpaceData>({
  name: 'getSpaces',
  multiCall: async (spaceIds) => {
    if (spaceIds.length === 0) return []
    const res = await datahubQueryRequest<
      GetSpacesQuery,
      GetSpacesQueryVariables
    >({
      document: GET_SPACES,
      variables: { ids: spaceIds },
    })

    return res.spaces.data.map((space) => mapDatahubSpaceFragment(space))
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result?.id ?? '',
  },
})

export const getSpaceQuery = createQuery({
  key: 'space',
  fetcher: getSpaces,
  defaultConfigGenerator: (spaceId) => ({
    enabled: !!spaceId,
  }),
})

export const getSpaceByOwnerQuery = createQuery({
  key: 'space',
  fetcher: async (owner: string) => {
    const res = await datahubQueryRequest<GetSpacesQuery, { owner: string }>({
      document: GET_SPACES_BY_OWNER,
      variables: { owner },
    })

    return res.spaces.data.map((space) => mapDatahubSpaceFragment(space))
  },
  defaultConfigGenerator: (owner) => ({
    enabled: !!owner,
  }),
})

export type PaginatedSpacesData = {
  data: string[]
  page: number
  hasMore: boolean
  totalData: number
}

type Data = {
  address: string
  pageSize?: number
}

async function getPaginatedSpaceIdsByAddress({
  page,
  address,
  client,
  pageSize,
}: {
  page: number
  client?: QueryClient | null
  pageSize?: number
} & Data): Promise<PaginatedSpacesData> {
  if (!address || !client)
    return { data: [], page, hasMore: false, totalData: 0 }

  const oldIds = getPaginatedSpaceIdsAddress.getFirstPageData(client, {
    address,
  })

  const chatPerPage = SPACE_PER_PAGE
  const firstPageDataLength = oldIds?.length || chatPerPage

  const spacesPerPage = pageSize || chatPerPage

  // only first page that has dynamic content, where its length can increase from:
  // - subscription
  // - invalidation
  // so the offset has to accommodate the length of the current first page
  let offset = Math.max((page - 2) * spacesPerPage + firstPageDataLength, 0)
  if (page === 1) offset = 0

  const res = await datahubQueryRequest<
    { spaces: { data: GetSpacesQuery['spaces']['data']; total: number } },
    {
      owner: string
      pageSize: number
      offset: number
      orderBy: string
      orderDirection: QueryOrder
    }
  >({
    document: GET_PAGINATED_SPACES_BY_OWNER,
    variables: {
      owner: address,
      pageSize: spacesPerPage,
      offset,
      orderBy: 'createdAtTime',
      orderDirection: QueryOrder.Desc,
    },
  })
  const optimisticIds = new Set<string>()
  const ids: string[] = []
  const messages: SpaceData[] = []
  res.spaces.data.forEach((space) => {
    optimisticIds.add('')

    const id = space.id
    ids.push(id)

    const mapped = mapDatahubSpaceFragment(space)
    messages.push(mapped)
    getSpaceQuery.setQueryData(client, id, mapped)
  })
  const totalData = res.spaces.total ?? 0
  const hasMore = offset + ids.length < totalData

  const idsSet = new Set<string>(ids)

  // only adding the client optimistic ids, and unincluded ids if refetching first page
  // for fetching first page, no ids that has been fetched will be removed
  // ex: first fetch: id 1-50, and after invalidation, there is new data id 0
  // the result should be id 0-50 instead of 0-49
  let unincludedFirstPageIds: string[] = []
  if (page === 1 && oldIds) {
    const oldOptimisticIds = []

    let unincludedIdsIndex = oldIds.length

    // for example, if the page size is 3, and there is 1 new id
    // ids: [new, old1, old2], and oldIds: [old1, old2, old3]
    // so we need to get the unincludedOldIds from the end of the array (old3)
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
    data: [...messages.map(({ id }) => id), ...unincludedFirstPageIds],
    page,
    hasMore,
    totalData,
  }
}

const SPACE_IDS_QUERY_KEY = 'spaces'
const getQueryKey = (data: Data) => [SPACE_IDS_QUERY_KEY, data]
export const getPaginatedSpaceIdsAddress = {
  getQueryKey,
  getFirstPageData: (client: QueryClient, data: Data) => {
    const cachedData = client?.getQueryData(getQueryKey(data))
    return ((cachedData as any)?.pages?.[0] as PaginatedSpacesData | undefined)
      ?.data
  },
  getCurrentPageNumber: (client: QueryClient, data: Data) => {
    const cachedData = client?.getQueryData(getQueryKey(data))
    return (cachedData as any)?.pages?.length
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    data: Data,
    page = 1,
    pageSize?: number
  ) => {
    const res = await getPaginatedSpaceIdsByAddress({
      ...data,
      page,
      client,
      pageSize,
    })
    if (!client) return res

    client.setQueryData(getQueryKey(data), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setQueryFirstPageData: (
    client: QueryClient,
    data: Data,
    updater: (oldIds?: string[]) => string[] | undefined | null
  ) => {
    client.setQueryData(getQueryKey(data), (oldData: any) => {
      const firstPage = oldData?.pages?.[0] as PaginatedSpacesData | undefined
      const newPages = [...(oldData?.pages ?? [])]
      const newFirstPageMessageIds = updater(firstPage?.data)
      newPages.splice(0, 1, {
        ...firstPage,
        data: newFirstPageMessageIds,
        totalData: newFirstPageMessageIds?.length ?? 0,
      } as PaginatedSpacesData)
      return {
        pageParams: [...(oldData?.pageParams ?? [])],
        pages: [...newPages],
      }
    })
  },
  invalidateLastQuery: (client: QueryClient, data: Data) => {
    client.refetchQueries(getQueryKey(data), {
      refetchPage: (_, index, allPages) => {
        const lastPageIndex = allPages.length - 1
        if (index !== lastPageIndex) return false
        // only fetch if its the last page and its the real "last" page, where hasMore is false
        if (
          !allPages[lastPageIndex] ||
          !(allPages[lastPageIndex] as { hasMore: boolean }).hasMore
        )
          return true
        return false
      },
    })
  },
  invalidateFirstQuery: (client: QueryClient, data: Data) => {
    client.invalidateQueries(getQueryKey(data), {
      refetchPage: (_, index) => index === 0,
    })
  },
  useInfiniteQuery: (
    data: Data,
    config?: QueryConfig
  ): UseInfiniteQueryResult<PaginatedSpacesData, unknown> => {
    const client = useQueryClient()
    return useInfiniteQuery({
      ...config,
      queryKey: getQueryKey(data),
      queryFn: async ({ pageParam = 1, queryKey }) => {
        const [_, spaceId] = queryKey
        const res = await getPaginatedSpaceIdsByAddress({
          ...data,
          page: pageParam,
          client,
        })

        // hotfix because in offchain chat (/offchain/18634) its not updating cache when first invalidated from server
        if (pageParam === 1) {
          client.setQueryData<{
            pageParams: number[]
            pages: PaginatedSpacesData[]
          }>(getQueryKey(data), (oldData) => {
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
