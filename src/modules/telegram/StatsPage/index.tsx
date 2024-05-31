import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import PointsWidget from '@/modules/points/PointsWidget'
import { cx } from '@/utils/class-names'
import LeaderboardSection from './LeaderboardSection'

const StatsPage = () => {
  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      <PointsWidget className='sticky top-0' />
      <div className={cx('w-full flex-1 px-4 pt-4')}>
        <LeaderboardSection />
      </div>
    </LayoutWithBottomNavigation>
  )
}

export default StatsPage
