import Tabs from '@/components/Tabs'
import { cx } from '@/utils/class-names'
import LeaderboardTable from './LeaderboardTable'

const customColumnsClassNames = [undefined, undefined, 'md:w-[30%]']

const tabs = [
  {
    id: 'top-meme-makers',
    text: 'Top Meme Makers',
    content: () => (
      <LeaderboardTable
        role='creator'
        customColumnsClassNames={customColumnsClassNames}
      />
    ),
  },
  {
    id: 'top-meme-likers',
    text: 'Top Meme Likers',
    content: () => (
      <LeaderboardTable
        role='staker'
        customColumnsClassNames={customColumnsClassNames}
      />
    ),
  },
]

const LeaderboardSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <span className='text-lg font-semibold'>Weekly leaderboard</span>
        <span className='text-text-muted'>
          Compete with other meme lovers to get extra points later
        </span>
      </div>

      <Tabs
        className='p-0'
        panelClassName='mt-0 w-full max-w-full px-0'
        tabClassName={(selected) =>
          cx(
            {
              ['bg-background-primary/50 rounded-full [&>span]:!text-text']:
                selected,
            },
            '[&>span]:text-slate-300 leading-6 font-medium p-[10px] [&>span]:text-sm border-none'
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

export default LeaderboardSection
