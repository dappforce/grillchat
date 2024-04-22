import PopOver from '@/components/floating/PopOver'
import IncreaseStakeBanner from './IncreaseStakeBanner'
import LeaderboardTable from './LeaderboardTable'

type LeaderboardStatsDataProps = {
  address: string
}

const LeaderboardStatsData = ({ address }: LeaderboardStatsDataProps) => {
  const data = [
    {
      title: 'SUB earned this week',
      value: '84.11 SUB',
      tooltipText: 'blablabla',
    },
    {
      title: 'SUB earned in total',
      value: '234.13 SUB',
      tooltipText: 'blablabla',
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='item-center flex gap-4'>
        {data.map((item, index) => (
          <StatsCard key={index} {...item} />
        ))}
      </div>
      <IncreaseStakeBanner address={address} />
      <LeaderboardTable address={address} />
    </div>
  )
}

type StatsCardProps = {
  title: React.ReactNode
  value: React.ReactNode
  tooltipText?: string
}

const StatsCard = ({ title, value, tooltipText }: StatsCardProps) => {
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

      <span className='text-2xl font-semibold'>{value}</span>
    </div>
  )
}

export default LeaderboardStatsData
