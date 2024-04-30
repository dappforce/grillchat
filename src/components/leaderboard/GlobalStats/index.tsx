import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import { IoPeople } from 'react-icons/io5'
import LeaderboardTable from '../MyStats/LeaderboardTable'
import GlobalStatsDashboard from './GlobalStatsDashboard'

const customColumnsClassNames = ['w-[9.8%]', undefined, 'w-[30%]']

const GlobalStats = () => {
  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='row-[span_2] flex flex-col items-center gap-4 rounded-[20px] border border-[#6366F1]/20 bg-[#0053FF]/10 p-4'>
          <div
            className='flex items-center justify-center rounded-full'
            style={{
              background: 'white',
              width: `88px`,
              height: `88px`,
            }}
          >
            <IoPeople style={{ fontSize: '42px', color: '#5089F8' }} />
          </div>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-[22px] font-semibold leading-6'>
              Total Activity
            </span>
            <span className={mutedTextColorStyles}>this week</span>
          </div>
        </div>
        <GlobalStatsDashboard />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <LeaderboardTable
          role='staker'
          customColumnsClassNames={customColumnsClassNames}
        />
        <LeaderboardTable
          role='creator'
          customColumnsClassNames={customColumnsClassNames}
        />
      </div>
    </div>
  )
}

export default GlobalStats
