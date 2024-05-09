import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import { isTouchDevice } from '@/utils/device'
import { IoPeople } from 'react-icons/io5'
import { cx } from '../../../utils/class-names'
import LeaderboardTable from '../MyStats/LeaderboardTable'
import GlobalStatsDashboard from './GlobalStatsDashboard'

const customColumnsClassNames = ['md:w-[9.8%]', undefined, 'md:w-[30%]']

const sizeStyle = isTouchDevice() ? '70px' : '88px'

const GlobalStats = () => {
  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='flex flex-col-reverse gap-4 md:grid md:grid-cols-[calc(70%-8px),30%] md:gap-x-4'>
        <div className='grid grid-cols-2 gap-4'>
          <GlobalStatsDashboard />
        </div>
        <div
          className={cx(
            'flex gap-4 rounded-[20px] border border-[#6366F1]/20 bg-[#0053FF]/10',
            'items-center p-4 md:flex-col'
          )}
        >
          <div
            className='flex items-center justify-center rounded-full'
            style={{
              background: 'white',
              width: sizeStyle,
              height: sizeStyle,
            }}
          >
            <IoPeople style={{ fontSize: '42px', color: '#5089F8' }} />
          </div>
          <div className='flex flex-col gap-2 md:items-center'>
            <span className='text-xl font-semibold leading-6 md:text-[22px]'>
              Total Activity
            </span>
            <span className={mutedTextColorStyles}>this week</span>
          </div>
        </div>
      </div>
      <div className='flex grid-cols-2 flex-col gap-4 md:grid'>
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
