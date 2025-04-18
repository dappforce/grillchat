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

export const SPACE_FRAGMENT = gql`
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
  query getSpacesByOwner($owner: String!, $hidden: Boolean) {
    spaces(
      args: { filter: { ownedByAccountAddress: $owner, hidden: $hidden } }
    ) {
      data {
        ...SpaceFragment
      }
    }
  }
`

export const GET_PAGINATED_SPACES_BY_OWNER = gql`
  ${SPACE_FRAGMENT}
  query getSpacesPaginatedSpacesByOwner(
    $owner: String!
    $hidden: Boolean
    $pageSize: Int!
    $offset: Int!
    $orderBy: String!
    $orderDirection: QueryOrder!
  ) {
    spaces(
      args: {
        filter: { ownedByAccountAddress: $owner, hidden: $hidden }
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

export const GET_SPACE_IDS_BY_FOLLOWER = gql`
  query getSpaceIdsByFollower($accountId: String!) {
    spaceFollowers(args: { filter: { accountId: $accountId } }) {
      data {
        followingSpace {
          id
        }
      }
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
  key: 'spaceByOwner',
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

export const getSpaceIdsByFollower = createQuery({
  key: 'spaceIdByFollower',
  fetcher: async (accountId: string) => {
    const res = await datahubQueryRequest<
      { spaceFollowers: { data: { followingSpace: { id: string } }[] } },
      { accountId: string }
    >({
      document: GET_SPACE_IDS_BY_FOLLOWER,
      variables: { accountId },
    })

    return res.spaceFollowers.data.map((item) => item.followingSpace.id)
  },
  defaultConfigGenerator: (accountId) => ({
    enabled: !!accountId,
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
  isHidden?: boolean
}

async function getPaginatedSpaceIdsByAddress({
  page,
  address,
  client,
  pageSize,
  isHidden,
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

  let offset = Math.max((page - 2) * spacesPerPage + firstPageDataLength, 0)
  if (page === 1) offset = 0

  const res = await datahubQueryRequest<
    { spaces: { data: GetSpacesQuery['spaces']['data']; total: number } },
    {
      owner: string
      hidden?: boolean
      pageSize: number
      offset: number
      orderBy: string
      orderDirection: QueryOrder
    }
  >({
    document: GET_PAGINATED_SPACES_BY_OWNER,
    variables: {
      owner: address,
      hidden: isHidden,
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
