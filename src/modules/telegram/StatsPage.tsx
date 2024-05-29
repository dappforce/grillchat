import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useIsMounted from '@/hooks/useIsMounted'
import { SDKProvider } from '@tma.js/sdk-react'
import MainContent from '../chat/HomePage/epic-leaderboard/MainContent'

const StatsPage = () => {
  const isMounted = useIsMounted()

  return (
    <SDKProvider>
      <LayoutWithBottomNavigation withFixedHeight className='relative'>
        {isMounted && <StatsPageContent />}
      </LayoutWithBottomNavigation>
    </SDKProvider>
  )
}

const StatsPageContent = () => {
  return <MainContent />
}

export default StatsPage
