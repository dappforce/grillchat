import Tabs from '@/components/Tabs'
import { cx } from '@/utils/class-names'
import LeaderboardTable from './LeaderboardTable'

const customColumnsClassNames = ['md:w-[9.8%]', undefined, 'md:w-[30%]']

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
    <div className='overflow-hidden rounded-2xl bg-white'>
      <Tabs
        className='p-0 first:[&>span]:rounded-s-none last:[&>span]:rounded-e-none'
        panelClassName='mt-0 w-full max-w-full'
        tabClassName={(selected) =>
          cx(
            {
              ['border-none bg-[#EFF4FF] [&>span]:!text-text-primary']:
                selected,
            },
            'border-t-0 border-r-0 border-l-0 [&>span]:text-slate-500 leading-6 font-medium py-[10px]'
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
