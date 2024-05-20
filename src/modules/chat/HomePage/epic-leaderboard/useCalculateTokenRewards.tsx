import { LeaderboardRole } from '@/services/datahub/leaderboard'
import {
  getTokenomicMetadataQuery,
  getUserStatisticsQuery,
} from '@/services/datahub/leaderboard/query'
import BN from 'bignumber.js'
import epicConfig from '../../../../constants/config/epic'

const { rewardPool } = epicConfig

type CalculateTokenRewardProps = {
  address?: string
  role?: LeaderboardRole
  points?: string
}

const useCalculateTokenRewards = ({
  address,
  role,
  points,
}: CalculateTokenRewardProps) => {
  const {
    data: maxDailyRewardPoints,
    isLoading: isMaxDailyRewardPointsLoading,
  } = getTokenomicMetadataQuery.useQuery({})

  const { data: userStats, isLoading: isUserStatsLoading } =
    getUserStatisticsQuery.useQuery({ address: address || '' })

  if (isMaxDailyRewardPointsLoading || (!points && isUserStatsLoading)) {
    return {
      isLoading: true,
      data: '0',
    }
  }

  const tokenPricePerPoint = maxDailyRewardPoints
    ? new BN(rewardPool).dividedBy(maxDailyRewardPoints)
    : new BN('0')

  let userPoints = new BN(points || '0')

  if (!points) {
    userPoints = role
      ? new BN(userStats?.[role].earnedPointsByPeriod || '0')
      : new BN(userStats?.staker.earnedPointsByPeriod || '0').plus(
          userStats?.creator.earnedPointsByPeriod || '0'
        )
  }

  const reward = tokenPricePerPoint.multipliedBy(userPoints || '0')
  return {
    isLoading: false,
    data: reward.toString(),
  }
}

export default useCalculateTokenRewards
