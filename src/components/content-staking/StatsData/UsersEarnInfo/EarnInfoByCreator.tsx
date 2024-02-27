import SkeletonFallback from '@/components/SkeletonFallback'
import StatsCard from '../StatsCard'

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
      title: 'Average rewards per post:',
      desc: <SkeletonFallback isLoading={false}>234.35 SUB</SkeletonFallback>,
      subDesc: '$15,656.34',
      tooltipText: 'blablabla',
    },
    {
      title: 'Average rewards per comment:',
      desc: <SkeletonFallback isLoading={false}>144.35 SUB</SkeletonFallback>,
      tooltipText: 'blablabla',
    },
  ]
  return (
    <div className='flex flex-col gap-8 p-4'>
      <ul>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </ul>
      <div className='grid grid-cols-2 items-stretch gap-4'>
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
  <li className='font-normal leading-8 text-slate-300'>{children}</li>
)

export default EarnInfoByCretor
