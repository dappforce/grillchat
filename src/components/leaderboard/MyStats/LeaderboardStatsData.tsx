import FormatBalance from '@/components/FormatBalance'
import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import PopOver from '@/components/floating/PopOver'
import { ZERO } from '@/constants/config'
import { useGetChainDataByNetwork } from '@/old/services/chainsInfo/query'
import { getUserStatisticsQuery } from '@/old/services/datahub/leaderboard/query'
import { LeaderboardRole } from '@/old/services/datahub/leaderboard/types'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { cx } from '../../../utils/class-names'

type LeaderboardStatsDataProps = {
  address: string
  leaderboardRole: LeaderboardRole
}

const LeaderboardStatsData = ({
  address,
  leaderboardRole,
}: LeaderboardStatsDataProps) => {
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
    value && decimal ? convertToBalanceWithDecimal(value, decimal) : ZERO

  const titleElement = (
    <span className={cx('text-base leading-[22px]', mutedTextColorStyles)}>
      {title}
    </span>
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
            <div className='flex items-start gap-2 md:items-center '>
              {titleElement}{' '}
              <span className='mt-[4px] md:mt-0'>
                <HiOutlineInformationCircle
                  className={cx(mutedTextColorStyles, 'h-4 w-4')}
                />
              </span>
            </div>
          }
        >
          <p>{tooltipText}</p>
        </PopOver>
      ) : (
        titleElement
      )}
      <div className='flex items-center justify-between gap-2'>
        <span className='text-lg font-semibold md:text-2xl'>
          {typeof value === 'number' ? (
            value
          ) : (
            <FormatBalance
              value={valueWithDecimals.toString()}
              loading={isLoading}
              defaultMaximumFractionDigits={2}
              symbol={tokenSymbol}
              sceletonClassName='max-w-full'
            />
          )}
        </span>
      </div>
    </div>
  )
}

export default LeaderboardStatsData
