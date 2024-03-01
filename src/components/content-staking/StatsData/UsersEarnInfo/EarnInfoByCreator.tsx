import FormatBalance from '@/components/FormatBalance'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { getBalanceInDollars } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import { mutedTextColorStyles } from '../../utils/commonStyles'
import StatsCard from '../StatsCard'
import Button from '@/components/Button'
import { isTouchDevice } from '@/utils/device'
import { useContentStakingContext } from '../../utils/ContentStakingContext'

const items = [
  '💎 Create high quality posts and comments',
  '📅 Be consistent and ensure you post at least once per day',
  '💬 Engage with your community in the comments section',
  '👁 Increase visibility by sharing your posts and comments to other social networks',
  '🤝 Interact with other users in the comments of popular posts to gain likes',
  '👍 Like the content of other creators to maximize your daily rewards',
]

const rewardsPerPost = '1000'
const rewardsPerComment = '100'

const EarnInfoByCretor = () => {
  const { tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}
  const { isLockedTokens } = useContentStakingContext()
  const tokenPrice = getPriceQuery.useQuery('subsocial').data?.current_price
  const cardsItems = [
    {
      title: 'Possible rewards per post:',
      desc: (
        <FormatBalance
          value={rewardsPerPost}
          symbol={tokenSymbol}
          defaultMaximumFractionDigits={3}
        />
      ),
      subDesc: (
        <FormatBalance
          value={getBalanceInDollars(rewardsPerPost, tokenPrice)}
          symbol={'$'}
          defaultMaximumFractionDigits={2}
          startFromSymbol
        />
      ),
      tooltipText: 'The average amount of rewards that posts on Subsocial earn',
    },
    {
      title: 'Possible rewards per commen:',
      desc: (
        <FormatBalance
          value={rewardsPerComment}
          symbol={tokenSymbol}
          defaultMaximumFractionDigits={3}
        />
      ),
      subDesc: (
        <FormatBalance
          value={getBalanceInDollars(rewardsPerComment, tokenPrice)}
          symbol={'$'}
          defaultMaximumFractionDigits={2}
          startFromSymbol
        />
      ),
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
      <Button
        variant={isLockedTokens ? 'primaryOutline' : 'primary'}
        href='https://grill.so/posts/new'
        target='_blank'
        size={isTouchDevice() ? 'md' : 'lg'}
        className={cx('mt-4 w-fit self-center', {
          ['text-text-primary']: isLockedTokens,
        })}
      >
        Start posting
      </Button>
    </div>
  )
}

type ListItemProps = {
  children: React.ReactNode
}

const ListItem = ({ children }: ListItemProps) => (
  <li className={cx('font-normal leading-8', mutedTextColorStyles)}>
    {children}
  </li>
)

export default EarnInfoByCretor
