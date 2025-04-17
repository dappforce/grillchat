import { getPostQuery } from '@/services/api/query'
import { QueryConfig } from '@/subsocial-query'
import { PostData } from '@subsocial/api/types'
import {
  QueryClient,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { GetPostsQuery, QueryOrder } from '../generated-query'
import { mapDatahubPostFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'
import { DATAHUB_POST_FRAGMENT } from './fetcher'
import { POSTS_PER_PAGE, PaginatedPostsData } from './query'

export const GET_PAGINATED_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query getPaginatedPosts(
    $pageSize: Int!
    $offset: Int!
    $orderBy: String!
    $orderDirection: QueryOrder!
  ) {
    posts(
      args: {
        filter: { postKind: "RegularPost", hidden: false }
        pageSize: $pageSize
        offset: $offset
        orderBy: $orderBy
        orderDirection: $orderDirection
      }
    ) {
      data {
        ...DatahubPostFragment
      }
      total
    }
  }
`

type HomePostsData = {
  pageSize?: number
}

async function getHomePagePostIdsRaw({
  page,
  client,
  pageSize,
}: {
  page: number
  client?: QueryClient | null
  pageSize?: number
} & HomePostsData): Promise<PaginatedPostsData> {
  if (!client) return { data: [], page, hasMore: false, totalData: 0 }

  const oldIds = getHomePagePostIds.getFirstPageData(client, { pageSize })

  const chatPerPage = POSTS_PER_PAGE
  const firstPageDataLength = oldIds?.length || chatPerPage

  const postsPerPage = pageSize || chatPerPage

  let offset = Math.max((page - 2) * postsPerPage + firstPageDataLength, 0)
  if (page === 1) offset = 0

  const res = await datahubQueryRequest<
    { posts: { data: GetPostsQuery['posts']['data']; total: number } },
    {
      pageSize: number
      offset: number
      orderBy: string
      orderDirection: QueryOrder
    }
  >({
    document: GET_PAGINATED_POSTS,
    variables: {
      pageSize: postsPerPage,
      offset,
      orderBy: 'createdAtTime',
      orderDirection: QueryOrder.Desc,
    },
  })
  const optimisticIds = new Set<string>()
  const ids: string[] = []
  const posts: PostData[] = []
  res.posts.data.forEach((post) => {
    optimisticIds.add('')

    const id = post.id
    ids.push(id)

    const mapped = mapDatahubPostFragment(post)
    posts.push(mapped)
    getPostQuery.setQueryData(client, id, mapped)
  })
  const totalData = res.posts.total ?? 0
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
    data: [...posts.map(({ id }) => id), ...unincludedFirstPageIds],
    page,
    hasMore,
    totalData,
  }
}

const HOME_PAGE_POST_IDS_QUERY_KEY = 'postIds'
const getPaginatedQueryKey = (data: HomePostsData) => [
  HOME_PAGE_POST_IDS_QUERY_KEY,
  data,
]
export const getHomePagePostIds = {
  getPaginatedQueryKey,
  getFirstPageData: (client: QueryClient, data: HomePostsData) => {
    const cachedData = client?.getQueryData(getPaginatedQueryKey(data))
    return ((cachedData as any)?.pages?.[0] as PaginatedPostsData | undefined)
      ?.data
  },
  getCurrentPageNumber: (client: QueryClient, data: HomePostsData) => {
    const cachedData = client?.getQueryData(getPaginatedQueryKey(data))
    return (cachedData as any)?.pages?.length
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    data: HomePostsData,
    page = 1,
    pageSize?: number
  ) => {
    const res = await getHomePagePostIdsRaw({
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
    data: HomePostsData,
    updater: (oldIds?: string[]) => string[] | undefined | null
  ) => {
    client.setQueryData(getPaginatedQueryKey(data), (oldData: any) => {
      const firstPage = oldData?.pages?.[0] as PaginatedPostsData | undefined
      const newPages = [...(oldData?.pages ?? [])]
      const newFirstPagePostIds = updater(firstPage?.data)
      newPages.splice(0, 1, {
        ...firstPage,
        data: newFirstPagePostIds,
        totalData: newFirstPagePostIds?.length ?? 0,
      } as PaginatedPostsData)
      return {
        pageParams: [...(oldData?.pageParams ?? [])],
        pages: [...newPages],
      }
    })
  },
  invalidateLastQuery: (client: QueryClient, data: HomePostsData) => {
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
  invalidateFirstQuery: (client: QueryClient, data: HomePostsData) => {
    client.invalidateQueries(getPaginatedQueryKey(data), {
      refetchPage: (_, index) => index === 0,
    })
  },
  useInfiniteQuery: (
    data: HomePostsData,
    config?: QueryConfig
  ): UseInfiniteQueryResult<PaginatedPostsData, unknown> => {
    const client = useQueryClient()
    return useInfiniteQuery({
      ...config,
      queryKey: getPaginatedQueryKey(data),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await getHomePagePostIdsRaw({
          ...data,
          page: pageParam,
          client,
        })

        if (pageParam === 1) {
          client.setQueryData<{
            pageParams: number[]
            pages: PaginatedPostsData[]
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
