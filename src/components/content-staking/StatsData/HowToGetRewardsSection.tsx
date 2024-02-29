import Button from '@/components/Button'
import PopOver from '@/components/floating/PopOver'
import { cx } from '@/utils/class-names'
import { FiInfo } from 'react-icons/fi'
import { sectionBg } from '../utils/SectionWrapper'
import { mutedTextColorStyles, sectionTitleStyles } from '../utils/commonStyles'
import { isTouchDevice } from '@/utils/device'

const items = [
  {
    title: 'Staker Rewards',
    desc: 'Like posts and comments of other users to earn staking rewards.',
    tooltipText: 'blablabla',
    buttonLink: '',
    buttonText: 'My feed',
  },
  {
    title: 'Creator Rewards',
    desc: 'Create posts and comments to earn rewards from every like it every like they receive.',
    tooltipText: 'blablabla',
    buttonLink: '',
    buttonText: 'Create a post',
  },
]

const HowToGetRewardsSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className={sectionTitleStyles}>
        How to get rewards
      </div>
      <div className='flex md:flex-row flex-col items-stretch gap-4'>
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
  tooltipText: string
  buttonLink: string
  buttonText: string
}

const CardItem = ({
  title,
  desc,
  tooltipText,
  buttonLink,
  buttonText,
}: CardItemProps) => {
  return (
    <div
      className={cx('flex w-full flex-col gap-4 rounded-2xl p-4', sectionBg)}
    >
      <div className='flex flex-col gap-2'>
        <div className='md:text-xl text-lg font-medium leading-[30px] text-text'>
          <PopOver
            trigger={
              <div className={cx('flex items-center gap-2')}>
                {title}
                <FiInfo className='block text-xs text-slate-400' />
              </div>
            }
            panelSize='sm'
            triggerClassName={tooltipText}
            yOffset={4}
            placement='top'
            triggerOnHover
          >
            {tooltipText}
          </PopOver>
        </div>
        <div className={cx('text-base font-normal', mutedTextColorStyles)}>{desc}</div>
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
