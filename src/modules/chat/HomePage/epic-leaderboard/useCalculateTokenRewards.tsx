import { LeaderboardRole } from '@/services/datahub/leaderboard'
import {
  getActiveStakingStatsByUserQuery,
  getGeneralStatisticsByPeriodQuery,
} from '@/services/datahub/leaderboard/query'
import { useMyMainAddress } from '@/stores/my-account'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import epicConfig from '../../../../constants/config/epic'

const { rewardPool } = epicConfig

type CalculateTokenRewardsProps = {
  address?: string
  role?: LeaderboardRole
}

const useCalculateTokenRewards = ({
  address,
  role,
}: CalculateTokenRewardsProps) => {
  const myAddress = useMyMainAddress()

  const userAddress = address || myAddress

  if (!userAddress) {
    return {
      isLoading: false,
      data: '0',
    }
  }

  let startOfWeekTimestamp = dayjs.utc().startOf('day')

  let daysToMonday = startOfWeekTimestamp.day() - 1

  if (daysToMonday < 0) {
    daysToMonday += 7
  }
  startOfWeekTimestamp = startOfWeekTimestamp.subtract(daysToMonday, 'day')

  const params = Array.from({ length: daysToMonday + 1 }).map((_, index) => {
    return {
      address: userAddress,
      dayTimestamp: startOfWeekTimestamp.add(index, 'day').unix(),
    }
  })

  const dayTimestamps = params.map((item) => item.dayTimestamp.toString())

  const generalStatsByDays =
    getGeneralStatisticsByPeriodQuery.useQueries(dayTimestamps)

  const statsByUsersQueries = getActiveStakingStatsByUserQuery.useQueries(
    params,
    { enabled: !!userAddress }
  )

  const statsByUsersLoading = statsByUsersQueries.some(
    (items) => items.isLoading
  )
  const generalStatsByDaysLoading = generalStatsByDays.some(
    (items) => items.isLoading
  )

  const statsByUsersData = statsByUsersQueries.map((items) => items.data)
  const generalStatsByDaysData = generalStatsByDays.map((items) => items.data)

  const rewardPoolPerDay = new BN(rewardPool / 7)

  const res = statsByUsersData.map((item, index) => {
    const generalStatsByDay = generalStatsByDaysData[index]

    const totalUsetPoints = role
      ? new BN(item?.[role].earnedPointsByPeriod || '0')
      : new BN(item?.staker.earnedPointsByPeriod || '0').plus(
          item?.creator.earnedPointsByPeriod || '0'
        )

    const totalEarnedPoints = new BN(
      generalStatsByDay?.creatorEarnedPointsTotal || '0'
    ).plus(generalStatsByDay?.stakersEarnedPointsTotal || '0')

    const rewardPerPoint = !totalEarnedPoints.isZero()
      ? rewardPoolPerDay.dividedBy(totalEarnedPoints)
      : new BN('0')

    return rewardPerPoint.multipliedBy(totalUsetPoints)
  })

  const reward = res.reduce((acc, item) => acc.plus(item), new BN('0'))

  return {
    isLoading: statsByUsersLoading || generalStatsByDaysLoading,
    data: reward.toString(),
  }
}

export default useCalculateTokenRewards
