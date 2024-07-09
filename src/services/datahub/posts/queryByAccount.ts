import { CHAT_PER_PAGE } from '@/constants/chat'
import { getPostQuery } from '@/services/api/query'
import {
  commentIdsOptimisticEncoder,
  isClientGeneratedOptimisticId,
} from '@/services/subsocial/commentIds/optimistic'
import { PostData } from '@subsocial/api/types'
import {
  QueryClient,
  QueryClientConfig,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { gql } from 'graphql-request'
import {
  GetCommentIdsInPostIdQuery,
  GetCommentIdsInPostIdQueryVariables,
  QueryOrder,
} from '../generated-query'
import { mapDatahubPostFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'
import { DATAHUB_POST_FRAGMENT } from './fetcher'
import { PaginatedPostsData } from './query'

const GET_COMMENT_IDS_IN_POST_ID = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetCommentIdsInPostId($args: FindPostsWithFilterArgs!) {
    posts(args: $args) {
      data {
        ...DatahubPostFragment
      }
      total
    }
  }
`
async function getPaginatedPostIdsByRootPostIdAndAccount({
  page,
  postId,
  account,
  client,
}: {
  postId: string
  page: number
  account: string
  client?: QueryClient | null
}): Promise<PaginatedPostsData> {
  if (!postId || !client)
    return { data: [], page, hasMore: false, totalData: 0 }

  const oldIds = getPaginatedPostIdsByPostIdAndAccount.getFirstPageData(
    client,
    postId,
    account
  )?.data
  const firstPageDataLength = oldIds?.length || CHAT_PER_PAGE

  // only first page that has dynamic content, where its length can increase from:
  // - subscription
  // - invalidation
  // so the offset has to accommodate the length of the current first page
  let offset = Math.max((page - 2) * CHAT_PER_PAGE + firstPageDataLength, 0)
  if (page === 1) offset = 0

  const res = await datahubQueryRequest<
    GetCommentIdsInPostIdQuery,
    GetCommentIdsInPostIdQueryVariables
  >({
    document: GET_COMMENT_IDS_IN_POST_ID,
    variables: {
      args: {
        filter: {
          rootPostId: postId,
          createdByAccountAddress: account,
        },
        orderBy: 'createdAtTime',
        orderDirection: QueryOrder.Desc,
        pageSize: CHAT_PER_PAGE,
        offset,
      },
    },
  })
  const optimisticIds = new Set<string>()
  const ids: string[] = []
  const messages: PostData[] = []
  res.posts.data.forEach((post) => {
    optimisticIds.add('')

    const id = post.id
    ids.push(id)

    const mapped = mapDatahubPostFragment(post)
    messages.push(mapped)
    getPostQuery.setQueryData(client, id, mapped)
  })
  const totalData = res.posts.total ?? 0
  const hasMore = offset + ids.length < totalData

  const idsSet = new Set<string>(ids)

  // only adding the client optimistic ids, and unincluded ids if refetching first page
  // for fetching first page, no ids that has been fetched will be removed
  // ex: first fetch: id 1-50, and after invalidation, there is new data id 0
  // the result should be id 0-50 instead of 0-49
  let unincludedOptimisticIds: string[] = []
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

      if (isClientGeneratedOptimisticId(id)) {
        oldOptimisticIds.unshift(id)
      }

      if (hasFoundIncludedId) continue

      if (!idsSet.has(id)) {
        unincludedIdsIndex = i
      } else {
        hasFoundIncludedId = true
      }
    }

    unincludedFirstPageIds = oldIds.slice(unincludedIdsIndex)
    unincludedOptimisticIds = oldOptimisticIds.filter(
      (id) => !optimisticIds.has(commentIdsOptimisticEncoder.decode(id))
    )
  }

  return {
    data: [
      ...unincludedOptimisticIds,
      ...messages.map(({ id }) => id),
      ...unincludedFirstPageIds,
    ],
    page,
    hasMore,
    totalData,
  }
}

const COMMENT_IDS_QUERY_KEY = 'commentsByAccount'
const getQueryKey = (postId: string, account: string) => [
  COMMENT_IDS_QUERY_KEY,
  postId,
  account,
]
export const getPaginatedPostIdsByPostIdAndAccount = {
  getQueryKey,
  getFirstPageData: (client: QueryClient, postId: string, account: string) => {
    const cachedData = client?.getQueryData(getQueryKey(postId, account))
    return (cachedData as any)?.pages?.[0] as PaginatedPostsData | undefined
  },
  fetchFirstPageQuery: async (
    client: QueryClient | null,
    postId: string,
    account: string,
    page = 1
  ) => {
    const res = await getPaginatedPostIdsByRootPostIdAndAccount({
      postId,
      page,
      account,
      client,
    })
    if (!client) return res

    client.setQueryData(getQueryKey(postId, account), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setQueryFirstPageData: (
    client: QueryClient,
    postId: string,
    updater: (oldIds?: string[]) => string[] | undefined | null,
    account: string
  ) => {
    client.setQueryData(getQueryKey(postId, account), (oldData: any) => {
      const firstPage = oldData?.pages?.[0] as PaginatedPostsData | undefined
      const newPages = [...(oldData?.pages ?? [])]
      const newFirstPageMessageIds = updater(firstPage?.data)
      newPages.splice(0, 1, {
        ...firstPage,
        data: newFirstPageMessageIds,
        totalData: newFirstPageMessageIds?.length ?? 0,
      } as PaginatedPostsData)
      return {
        pageParams: [...(oldData?.pageParams ?? [])],
        pages: [...newPages],
      }
    })
  },
  invalidateFirstQuery: (
    client: QueryClient,
    postId: string,
    account: string
  ) => {
    client.invalidateQueries(getQueryKey(postId, account), {
      refetchPage: (_, index) => index === 0,
    })
  },
  useInfiniteQuery: (
    postId: string,
    account: string,
    config?: QueryClientConfig
  ): UseInfiniteQueryResult<PaginatedPostsData, unknown> => {
    const client = useQueryClient()
    return useInfiniteQuery({
      ...config,
      queryKey: getQueryKey(postId, account),
      queryFn: async ({ pageParam = 1, queryKey }) => {
        const [_, postId] = queryKey
        const res = await getPaginatedPostIdsByRootPostIdAndAccount({
          postId,
          page: pageParam,
          account,
          client,
        })

        // hotfix because in offchain chat (/offchain/18634) its not updating cache when first invalidated from server
        if (pageParam === 1) {
          client.setQueryData<{
            pageParams: number[]
            pages: PaginatedPostsData[]
          }>(getQueryKey(postId, account), (oldData) => {
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
