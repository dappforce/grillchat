import { useSendEvent } from '@/stores/analytics'
import { isTouchDevice } from '@/utils/device'
import Button from '../Button'
import BannerSection from './Banner'
import FAQSection from './FAQ'
import HowItWorksSection from './FAQ/HowItWorksSection'
import StatsData from './StatsData'
import NoSubSection from './StatsData/NoSubSection'
import UsersEarnInfo from './StatsData/UsersEarnInfo'
import UnstakingSection from './UnstakingSection'
import { BlockNumberContextWrapper } from './utils/BlockNumberContext'
import { sectionTitleStyles } from './utils/commonStyles'
import { ContentStakingContextWrapper } from './utils/ContentStakingContext'
import SectionWrapper from './utils/SectionWrapper'

export const ContentStaking = () => {
  const sendEvent = useSendEvent()

  return (
    <ContentStakingContextWrapper>
      <BlockNumberContextWrapper>
        <div className='flex flex-col gap-[50px]'>
          <BannerSection />
          <NoSubSection />
          <StatsData />
          <UnstakingSection />
          <UsersEarnInfo />
          <HowItWorksSection />
          <FAQSection />
          <SectionWrapper className='z-[1] flex flex-col items-center gap-4 px-4 py-6'>
            <div className={sectionTitleStyles}>Still have questions?</div>
            <Button
              variant='primaryOutline'
              className='border-text-primary text-text-primary'
              size={isTouchDevice() ? 'md' : 'lg'}
              onClick={() => sendEvent('cs_questions_chat_clicked')}
              href='grillapp.net/c/ask'
              target='_blank'
            >
              Ask us
            </Button>
          </SectionWrapper>
        </div>
      </BlockNumberContextWrapper>
    </ContentStakingContextWrapper>
  )
}

export default ContentStaking
