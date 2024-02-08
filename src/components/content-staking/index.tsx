import RangeInput from '../inputs/RangeInput'
import BannerSection from './Banner'
import EarnStats from './EarnStats'

export const ContentStaking = () => {
  return (
    <div className='flex flex-col gap-[50px]'>
      <BannerSection />
      <EarnStats />
      <RangeInput />
    </div>
  )
}

export default ContentStaking
