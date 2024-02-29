import { isTouchDevice } from '@/utils/device'
import Button from '../Button'
import BannerSection from './Banner'
import FAQSection from './FAQ'
import HowItWorksSection from './FAQ/HowItWorksSection'
import StatsData from './StatsData'
import UsersEarnInfo from './StatsData/UsersEarnInfo'
import { ContentStakingContextWrapper } from './utils/ContentStakingContext'
import SectionWrapper from './utils/SectionWrapper'
import { sectionTitleStyles } from './utils/commonStyles'

export const ContentStaking = () => {
  return (
    <ContentStakingContextWrapper>
      <div className='flex flex-col gap-[50px]'>
        <BannerSection />
        <StatsData />
        <UsersEarnInfo />
        <HowItWorksSection />
        <FAQSection />
        <SectionWrapper className='z-[1] flex flex-col items-center gap-4 px-4 py-6'>
          <div className={sectionTitleStyles}>Still have questions?</div>
          <Button
            variant='primaryOutline'
            className='text-text-primary'
            size={isTouchDevice() ? 'md' : 'lg'}
            href='grill.so/c/ask'
            target='_blank'
          >
            Ask us
          </Button>
        </SectionWrapper>
      </div>
    </ContentStakingContextWrapper>
  )
}

export default ContentStaking
