import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import PointsWidget from '@/modules/points/PointsWidget'

export default function AirdropPage() {
  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <PointsWidget className='sticky top-0' />
      <div className='flex flex-col gap-4 px-4 pt-4'>asdfasdf</div>
    </LayoutWithBottomNavigation>
  )
}
