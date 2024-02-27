import Button from '../Button'
import BannerSection from './Banner'
import FAQSection from './FAQ'
import HowItWorksSection from './FAQ/HowItWorksSection'
import StatsData from './StatsData'
import UsersEarnInfo from './StatsData/UsersEarnInfo'
import { ContentStakingContextWrapper } from './utils/ContentStakingContext'
import SectionWrapper from './utils/SectionWrapper'

export const ContentStaking = () => {
  return (
    <ContentStakingContextWrapper>
      <div className='flex flex-col gap-[50px]'>
        <BannerSection />
        <StatsData />
        <UsersEarnInfo />
        <HowItWorksSection />
        <FAQSection />
        <SectionWrapper className='flex flex-col items-center gap-4 px-4 py-6'>
          <div className='text-[28px] font-bold leading-none'>
            Still have questions? Ask others
          </div>
          <Button variant='primaryOutline' size='lg'>
            Open chat
          </Button>
        </SectionWrapper>
      </div>
    </ContentStakingContextWrapper>
  )
}

export default ContentStaking
