import Tabs from '@/components/Tabs'
import { LeaderboardDataPeriod } from '@/services/datahub/leaderboard/types'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import LeaderboardTable from './LeaderboardTable'

const customColumnsClassNames = [undefined, undefined, 'md:w-[30%]']

export const LeaderboardContent = () => {
  const [refetchedTab, setRefechedTab] = useState<{
    [key in LeaderboardDataPeriod]: boolean
  }>({
    allTime: true,
    week: true,
  })

  const commonProps = {
    refetchTab: refetchedTab,
    setRefetchTab: setRefechedTab,
    customColumnsClassNames,
  }

  const tabs = [
    {
      id: 'week',
      text: 'This week',
      content: () => <LeaderboardTable period='week' {...commonProps} />,
    },
    {
      id: 'allTime',
      text: 'All-Time',
      content: () => <LeaderboardTable period='allTime' {...commonProps} />,
    },
  ]

  return (
    <div className='flex w-full flex-col gap-4'>
      <Tabs
        className='rounded-full bg-slate-900 p-[2px]'
        panelClassName='mt-0 w-full max-w-full px-0 z-0'
        tabClassName={(selected) =>
          cx(
            {
              ['bg-background-primary/50 rounded-full [&>span]:!text-text']:
                selected,
            },
            '[&>span]:text-slate-300 leading-6 font-medium p-[6px] [&>span]:text-sm border-none'
          )
        }
        asContainer
        tabStyle='buttons'
        defaultTab={0}
        tabs={tabs}
      />
    </div>
  )
}
