import FormatBalance from '@/components/FormatBalance'
import SkeletonFallback from '@/components/SkeletonFallback'
import PopOver from '@/components/floating/PopOver'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getUserStatisticsQuery } from '@/services/datahub/leaderboard/query'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useLeaderboardContext } from '../LeaderboardContext'
import IncreaseStakeBanner from './IncreaseStakeBanner'
import LeaderboardTable from './LeaderboardTable'

type LeaderboardStatsDataProps = {
  address: string
}

const LeaderboardStatsData = ({ address }: LeaderboardStatsDataProps) => {
  const { leaderboardRole } = useLeaderboardContext()

  const { data: userStats, isLoading } = getUserStatisticsQuery.useQuery({
    address,
  })

  const { earnedByPeriod, earnedTotal, rank } =
    userStats?.[leaderboardRole] || {}

  const data = [
    {
      title: 'SUB earned this week',
      value: earnedByPeriod,
      tooltipText: 'blablabla',
      rank,
    },
    {
      title: 'SUB earned in total',
      value: earnedTotal,
      tooltipText: 'blablabla',
      rank,
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='item-center flex gap-4'>
        {data.map((item, index) => (
          <UserStatsCard key={index} {...item} isLoading={isLoading} />
        ))}
      </div>
      <IncreaseStakeBanner address={address} />
      <LeaderboardTable address={address} />
    </div>
  )
}

type StatsCardProps = {
  title: React.ReactNode
  value?: string
  tooltipText?: string
  rank?: number
  isLoading: boolean
}

const UserStatsCard = ({
  title,
  value,
  tooltipText,
  rank,
  isLoading,
}: StatsCardProps) => {
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const valueWithDecimals =
    value && decimal ? convertToBalanceWithDecimal(value, decimal) : new BN(0)

  const titleElement = (
    <span className='text-sm leading-[22px] text-text-muted'>{title}</span>
  )

  return (
    <div className='flex w-full flex-col gap-2 rounded-2xl bg-slate-800 p-4'>
      {tooltipText ? (
        <PopOver
          yOffset={6}
          panelSize='sm'
          placement='top'
          triggerOnHover
          trigger={titleElement}
        >
          <p>{tooltipText}</p>
        </PopOver>
      ) : (
        titleElement
      )}
      <div className='flex items-center justify-between gap-2'>
        <span className='text-2xl font-semibold'>
          {
            <FormatBalance
              value={valueWithDecimals.toString()}
              loading={isLoading}
              defaultMaximumFractionDigits={2}
              symbol={tokenSymbol}
            />
          }
        </span>
        {rank && (
          <SkeletonFallback isLoading={isLoading}>
            <span className='text-text-muted'>#{rank}</span>
          </SkeletonFallback>
        )}
      </div>
    </div>
  )
}

export default LeaderboardStatsData
