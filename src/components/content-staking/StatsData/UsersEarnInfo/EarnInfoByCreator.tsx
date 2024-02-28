import SkeletonFallback from '@/components/SkeletonFallback'
import StatsCard from '../StatsCard'
import { cx } from '@/utils/class-names'
import { mutedTextColorStyles } from '../../utils/commonStyles'

const items = [
  '💎 Create high quality posts and comments',
  '📅 Be consistent and ensure you post at least once per day',
  '💬 Engage with your community in the comments section',
  '👁 Increase visibility by sharing your posts and comments to other social networks',
  '🤝 Interact with other users in the comments of popular posts to gain likes',
  '👍 Like the content of other creators to maximize your daily rewards',
]

const EarnInfoByCretor = () => {
  const cardsItems = [
    {
      title: 'Possible rewards per post:',
      desc: <SkeletonFallback isLoading={false}>234.35 SUB</SkeletonFallback>,
      subDesc: '$15,656.34',
      tooltipText: 'The average amount of rewards that posts on Subsocial earn',
    },
    {
      title: 'Possible rewards per commen:',
      desc: <SkeletonFallback isLoading={false}>144.35 SUB</SkeletonFallback>,
      tooltipText:
        'The average amount of rewards that comments on Subsocial earn',
    },
  ]
  return (
    <div className='flex flex-col gap-4 p-4'>
      <ul>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </ul>
      <div className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2'>
        {cardsItems.map((props, i) => (
          <StatsCard key={i} {...props} />
        ))}
      </div>
    </div>
  )
}

type ListItemProps = {
  children: React.ReactNode
}

const ListItem = ({ children }: ListItemProps) => (
  <li className={cx('font-normal leading-8', mutedTextColorStyles)}>{children}</li>
)

export default EarnInfoByCretor
