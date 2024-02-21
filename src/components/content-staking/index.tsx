import BannerSection from './Banner'
import EarnStats from './EarnStats'
import EarnCalcSection from './EarnStats/EarnCalc'

export const ContentStaking = () => {
  return (
    <div className='flex flex-col gap-[50px]'>
      <BannerSection />
      <EarnStats />
      <EarnCalcSection />
    </div>
  )
}

export default ContentStaking
