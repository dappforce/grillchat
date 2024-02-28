import FAQIcon from '@/assets/icons/faq-icon.svg'
import Accordion from '@/components/Accordion'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import SectionWrapper from '../utils/SectionWrapper'
import { sectionTitleStyles } from '../utils/commonStyles'

const items = [
  {
    title: 'What is Content Staking?',
    content: (
      <>
        Content Staking allows creators to earn rewards for producing content on
        Subsocial, and rewards users for curating and interacting with their
        favorite pieces of content.
        <br /> <br />
        The system aims to grow the user and content base of Subsocial through
        incentives.
      </>
    ),
  },
  {
    title: 'Why should I lock my tokens?',
    content: (
      <>
        Locking at least 2,000 SUB will allow you to like posts, support your
        favorite creators, and earn even more SUB!
      </>
    ),
  },
  {
    title: 'How can I increase my rewards?',
    content: (
      <>
        To maximize your rewards, make sure to like at least 10 posts per day.
        The more SUB you lock, the more rewards you will get.
        <br /> <br />
        You can also earn rewards by creating good posts, comments, and shares
        that other users like.
      </>
    ),
  },
  {
    title: 'When will I receive my rewards?',
    content: <>Rewards are distributed every Monday for the previous week.</>,
  },
]

const FAQSection = () => {
  return (
    <div className='z-[1] flex flex-col gap-4'>
      <div className={sectionTitleStyles}>FAQ</div>
      <SectionWrapper className='relative overflow-hidden px-4 py-6'>
        {!isTouchDevice() && (
          <FAQIcon
            className={cx(
              'absolute right-[-38px] top-[-35px] rotate-[36deg] fill-opacity-100',
              'dark:[&>g]:fill-white/10 [&>g]:fill-slate-100'
            )}
          />
        )}
        <Accordion items={items} className='max-w-full md:max-w-[80%]' />
      </SectionWrapper>
    </div>
  )
}

export default FAQSection
