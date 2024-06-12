import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import PointsWidget from '@/modules/points/PointsWidget'
import { cx } from '@/utils/class-names'
import LeaderboardSection from './LeaderboardSection'

const StatsPage = () => {
  useTgNoScroll()

  return (
    <LayoutWithBottomNavigation className='relative' withFixedHeight>
      <PointsWidget isNoTgScroll className='sticky top-0' />
      <div className={cx('w-full flex-1 overflow-auto px-4 pt-4')}>
        <LeaderboardSection />
      </div>
    </LayoutWithBottomNavigation>
  )
}

export default StatsPage
