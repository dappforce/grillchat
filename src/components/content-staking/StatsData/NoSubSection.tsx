import { cx } from '@/utils/class-names'
import { useContentStakingContext } from '../utils/ContentStakingContext'
import { mutedTextColorStyles, sectionTitleStyles } from '../utils/commonStyles'
import { CardItem } from './HowToGetRewardsSection'

const items = [
  {
    title: 'Comment hot posts',
    desc: 'You will receive rewards in SUB tokens for every like your comment gets.',
    buttonLink: 'https://grillapp.net/?tab=posts&type=hot',
    buttonText: 'Go to Hot Posts',
    analyticsId: 'cs_go_to_hot_posts',
  },
  {
    title: 'Create quallity posts',
    desc: 'You will receive rewards in SUB tokens for every like your content gets.',
    buttonLink: 'https://grillapp.net/posts/new',
    buttonText: 'Create a post',
    analyticsId: 'cs_write_post',
  },
]

const NoSubSection = () => {
  const { currentStep } = useContentStakingContext()

  if (currentStep !== 'get-sub') return null

  return (
    <div className='z-[1] flex flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <div className={sectionTitleStyles}>
          Don&apos;t have SUB? You can still earn rewards
        </div>
        <div className={cx(mutedTextColorStyles, 'text-base leading-[22px]')}>
          Get rewarded for your content after registration even without having
          SUB tokens.
        </div>
      </div>
      <div className='flex flex-col items-stretch gap-4 md:flex-row'>
        {items.map((props, i) => (
          <CardItem key={i} {...props} buttonVariant='primaryOutline' />
        ))}
      </div>
    </div>
  )
}

export default NoSubSection
