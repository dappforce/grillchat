import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { mutedTextColorStyles, sectionTitleStyles } from '../utils/commonStyles'
import { sectionBg } from '../utils/SectionWrapper'

const items = [
  {
    title: 'Staker Rewards',
    desc: 'Like posts and comments of other users to earn staking rewards.',
    buttonLink: 'https://grillapp.net/?tab=feed',
    buttonText: 'My feed',
    analyticsId: 'cs_go_to_feed',
  },
  {
    title: 'Creator Rewards',
    desc: 'Create posts and comments to earn rewards from every like it every like they receive.',
    buttonLink: 'https://grillapp.net/posts/new',
    buttonText: 'Create a post',
    analyticsId: 'cs_write_post',
  },
]

const HowToGetRewardsSection = () => {
  return (
    <div className='z-[1] flex flex-col gap-4'>
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
  analyticsId: string
  buttonVariant?: 'primary' | 'primaryOutline'
}

export const CardItem = ({
  title,
  desc,
  buttonLink,
  buttonText,
  analyticsId,
  buttonVariant = 'primary',
}: CardItemProps) => {
  const sendEvent = useSendEvent()

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
        className={cx('self-center', {
          ['text-text-primary']: buttonVariant === 'primaryOutline',
        })}
        href={buttonLink}
        size={isTouchDevice() ? 'md' : 'lg'}
        target='__blank'
        variant={buttonVariant}
        onClick={() => sendEvent(analyticsId)}
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default HowToGetRewardsSection
