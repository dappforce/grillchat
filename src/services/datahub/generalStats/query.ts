import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
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
  query GetPostsByContent($search: String!, $postIds: [String!]!) {
    posts(
      args: {
        filter: {
          AND: [
            { hidden: false, postKind: "RegularPost" }
            { title: $search, OR: { body: $search } }
          ]
        }
      }
    ) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`

async function getPostsByContent(search: string) {
  if (!search) return []

  const res: any = await datahubQueryRequest({
    document: GET_POSTS_BY_CONTENT,
    variables: {
      search,
    },
  })

  console.log(res)

  return res.posts.data.map((post: any) => mapDatahubPostFragment(post))
}

export const getPostsBySpaceContentQuery = createQuery({
  key: 'getPostsByContent',
  fetcher: getPostsByContent,
})
