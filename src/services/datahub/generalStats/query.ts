import { constantsConfig } from '@/constants/config'
import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import { env } from 'process'
import {
  GetGeneralStatsQuery,
  GetGeneralStatsQueryVariables,
} from '../generated-query'
import { mapDatahubPostFragment } from '../mappers'
import { DATAHUB_POST_FRAGMENT } from '../posts/fetcher'
import { datahubQueryRequest } from '../utils'

const generalStatsId = 'generalStatsId'

const GET_GENERAL_STATS = gql`
  query GetGeneralStats {
    activeStakingTotalActivityMetricsForFixedPeriod(
      args: {
        period: ALL_TIME
        likedPostsCount: false
        likedCreatorsCount: false
        stakersEarnedTotal: true
        creatorEarnedTotal: false
      }
    ) {
      likedPostsCount
      likedCreatorsCount
      stakersEarnedTotal
      creatorEarnedTotal
    }
  }
`
type GeneralStats = {
  postsLiked: number
  creatorsLiked: number
  stakersEarnedTotal: string
  creatorsEarnedTotal: string
}
const getGeneralStats = poolQuery<string, GeneralStats>({
  name: 'getGeneralStats',
  multiCall: async () => {
    const res = await datahubQueryRequest<
      GetGeneralStatsQuery,
      GetGeneralStatsQueryVariables
    >({
      document: GET_GENERAL_STATS,
      variables: {},
    })

    const data = res.activeStakingTotalActivityMetricsForFixedPeriod

    return [
      {
        postsLiked: data.likedPostsCount ?? 0,
        creatorsLiked: data.likedCreatorsCount ?? 0,
        stakersEarnedTotal: data.stakersEarnedTotal ?? '',
        creatorsEarnedTotal: data.creatorEarnedTotal ?? '',
      },
    ]
  },
  resultMapper: {
    paramToKey: (id) => id,
    resultToKey: () => generalStatsId,
  },
})
export const getGeneralStatsQuery = createQuery({
  key: 'generalStats',
  fetcher: getGeneralStats,
})

const GET_POSTS_BY_SPACE_CONTENT = gql`
  query GetPostsBySpaceContent($search: String!) {
    posts(args: { filter: { spaceId: $search } }) {
      data {
        id
      }
    }
  }
`

async function getPostsBySpaceContent(search: string) {
  const res = await datahubQueryRequest<
    { posts: { data: { id: string }[] } },
    { search: string }
  >({
    document: GET_POSTS_BY_SPACE_CONTENT,
    variables: { search },
  })

  return res.posts.data.map(({ id }) => id)
}

export const GET_POSTS_BY_CONTENT = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetPostsByContent(
    $search: String!
    $spaceIds: [String!]!
    $postIds: [String!]!
  ) {
    posts(
      where: {
        AND: [
          { hidden_eq: false, isComment_eq: false }
          {
            title_containsInsensitive: $search
            OR: { body_containsInsensitive: $search }
          }
          { space: { id_in: $spaceIds }, OR: { id_in: $postIds } }
        ]
      }
    ) {
      ...PostFragment
    }
  }
`

async function getPostsByContent(search: string) {
  if (!search) return []

  const linkedPostIds = new Set<string>()
  const hubIds = env.NEXT_PUBLIC_SPACE_IDS
  hubIds?.split(',').forEach((hubId) => {
    const linkedChatIds = constantsConfig.linkedChatsForHubId[hubId] ?? []
    linkedChatIds.forEach((chatId) => linkedPostIds.add(chatId))
  })

  const res: any = await datahubQueryRequest({
    document: GET_POSTS_BY_CONTENT,
    variables: {
      search,
      spaceIds: env.NEXT_PUBLIC_SPACE_IDS,
      postIds: Array.from(linkedPostIds.values()),
    },
  })
  return res.posts.map((post: any) => mapDatahubPostFragment(post))
}

export const getPostsBySpaceContentQuery = createQuery({
  key: 'getPostsByContent',
  fetcher: getPostsByContent,
})
