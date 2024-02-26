import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import { datahubQueryRequest } from '../utils'

const generalStatsId = 'generalStatsId'

export const getGeneralStatsData = () => getGeneralStatsQuery.useQuery(generalStatsId)

const GET_GENERAL_STATS = gql`
  query GetGeneralStats {
    activeStakingTotalActivityMetricsForFixedPeriod(
      args: {
        period: WEEK
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
  multiCall: async () => {
    const res = await datahubQueryRequest<
      {
        activeStakingTotalActivityMetricsForFixedPeriod: {
          likedPostsCount: number
          likedCreatorsCount: number
          stakersEarnedTotal: string
          creatorEarnedTotal: string
        }
      },
      {}
    >({
      document: GET_GENERAL_STATS,
      variables: {},
    })

    const data = res.activeStakingTotalActivityMetricsForFixedPeriod

    return [
      {
        postsLiked: data.likedPostsCount,
        creatorsLiked: data.likedCreatorsCount,
        stakersEarnedTotal: data.stakersEarnedTotal,
        creatorsEarnedTotal: data.creatorEarnedTotal,
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
