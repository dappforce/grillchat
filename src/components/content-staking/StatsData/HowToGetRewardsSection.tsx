import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { sectionBg } from '../utils/SectionWrapper'
import { mutedTextColorStyles, sectionTitleStyles } from '../utils/commonStyles'

const items = [
  {
    title: 'Staker Rewards',
    desc: 'Like posts and comments of other users to earn staking rewards.',
    buttonLink: 'https://grill.so/?tab=feed',
    buttonText: 'My feed',
  },
  {
    title: 'Creator Rewards',
    desc: 'Create posts and comments to earn rewards from every like it every like they receive.',
    buttonLink: 'https://grill.so/posts/new',
    buttonText: 'Create a post',
  },
]

const HowToGetRewardsSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className={sectionTitleStyles}>How to get rewards</div>
      <div className='flex flex-col items-stretch gap-4 md:flex-row'>
        {items.map((props, i) => (
          <CardItem key={i} {...props} />
        ))}
      </div>
    </div>
  )
}

type CardItemProps = {
  title: string
  desc: string
  buttonLink: string
  buttonText: string
}

const CardItem = ({ title, desc, buttonLink, buttonText }: CardItemProps) => {
  return (
    <div
      className={cx('flex w-full flex-col gap-4 rounded-2xl p-4', sectionBg)}
    >
      <div className='flex flex-col gap-2'>
        <div className='text-lg font-medium leading-[30px] text-text md:text-xl'>
          {title}
        </div>
        <div className={cx('text-base font-normal', mutedTextColorStyles)}>
          {desc}
        </div>
      </div>
      <Button
        className='self-center'
        href={buttonLink}
        size={isTouchDevice() ? 'md' : 'lg'}
        target='__blank'
        variant='primary'
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default HowToGetRewardsSection
