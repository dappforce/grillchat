import FormatBalance from '@/components/FormatBalance'
import PopOver from '@/components/floating/PopOver'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getUserStatisticsQuery } from '@/services/datahub/leaderboard/query'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { useLeaderboardContext } from '../LeaderboardContext'

type LeaderboardStatsDataProps = {
  address: string
}

const LeaderboardStatsData = ({ address }: LeaderboardStatsDataProps) => {
  const { leaderboardRole } = useLeaderboardContext()

  const { data: userStats, isLoading } = getUserStatisticsQuery.useQuery({
    address,
  })

  const { earnedByPeriod, earnedTotal } = userStats?.[leaderboardRole] || {}

  const data = [
    {
      title: 'SUB earned this week',
      value: earnedByPeriod,
      tooltipText:
        'The amount of SUB rewards you have earned this week from Content Staking rewards',
    },
    {
      title: 'SUB earned in total',
      value: earnedTotal,
      tooltipText:
        'The total amount of SUB rewards you have earned this week from Content Staking rewards',
    },
  ]

  return (
    <div className='item-center flex gap-4'>
      {data.map((item, index) => (
        <UserStatsCard key={index} {...item} isLoading={isLoading} />
      ))}
    </div>
  )
}

type StatsCardProps = {
  title: React.ReactNode
  value?: string | number
  tooltipText?: string
  isLoading: boolean
}

export const UserStatsCard = ({
  title,
  value,
  tooltipText,
  isLoading,
}: StatsCardProps) => {
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const valueWithDecimals =
    value && decimal ? convertToBalanceWithDecimal(value, decimal) : new BN(0)

  const titleElement = (
    <span className='text-sm leading-[22px] text-text-muted'>{title}</span>
  )

  return (
    <div className='flex w-full flex-col gap-2 rounded-2xl bg-white p-4 dark:bg-slate-800'>
      {tooltipText ? (
        <PopOver
          yOffset={6}
          panelSize='sm'
          placement='top'
          triggerClassName='w-fit'
          triggerOnHover
          trigger={
            <div className='flex items-center gap-2'>
              {titleElement} <HiOutlineInformationCircle />
            </div>
          }
        >
          <p>{tooltipText}</p>
        </PopOver>
      ) : (
        titleElement
      )}
      <div className='flex items-center justify-between gap-2'>
        <span className='text-2xl font-semibold'>
          {typeof value === 'number' ? (
            value
          ) : (
            <FormatBalance
              value={valueWithDecimals.toString()}
              loading={isLoading}
              defaultMaximumFractionDigits={2}
              symbol={tokenSymbol}
            />
          )}
        </span>
      </div>
    </div>
  )
}

export default LeaderboardStatsData
