import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useIsMounted from '@/hooks/useIsMounted'
import { cx } from '@/utils/class-names'
import LeaderboardSection from './LeaderboardSection'

const StatsPage = () => {
  const isMounted = useIsMounted()

  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      {isMounted && (
        <div className={cx('w-full flex-1 px-4 pt-4')}>
          <LeaderboardSection />
        </div>
      )}
    </LayoutWithBottomNavigation>
  )
}

export default StatsPage
