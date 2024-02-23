import Button from '../Button'
import BannerSection from './Banner'
import EarnStats from './EarnStats'
import EarnCalcSection from './EarnStats/EarnCalc'
import FAQSection from './FAQ'
import HowItWorksSection from './FAQ/HowItWorksSection'
import SectionWrapper from './utils/SectionWrapper'

export const ContentStaking = () => {
  return (
    <div className='flex flex-col gap-[50px]'>
      <BannerSection />
      <EarnStats />
      <EarnCalcSection />
      <HowItWorksSection />
      <FAQSection />
      <SectionWrapper className='flex flex-col items-center gap-4 px-4 py-6'>
        <div className='text-2xl text-text font-bold leading-none'>
          Still have questions? Ask others
        </div>
        <Button variant='primaryOutline' size='lg'>
          Open chat
        </Button>
      </SectionWrapper>
    </div>
  )
}

export default ContentStaking
