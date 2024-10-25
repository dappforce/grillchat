import Button from '@/components/Button'
import FormatBalance from '@/components/FormatBalance'
import { useGetChainDataByNetwork } from '@/old/services/chainsInfo/query'
import { getPriceQuery } from '@/old/services/subsocial/prices/query'
import { useSendEvent } from '@/stores/analytics'
import { getBalanceInDollars } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { useContentStakingContext } from '../../utils/ContentStakingContext'
import { mutedTextColorStyles } from '../../utils/commonStyles'
import StatsCard from '../StatsCard'

const items = [
  <>💎 &nbsp;Create high quality posts and comments</>,
  <>📅 &nbsp;Be consistent and ensure you post at least once per day</>,
  <>💬 &nbsp;Engage with your community in the comments section</>,
  <>
    👁 &nbsp;Increase visibility by sharing your posts and comments to other
    social networks
  </>,
  <>
    🤝 &nbsp;Interact with other users in the comments of popular posts to gain
    likes
  </>,
  <>
    👍 &nbsp;Like the content of other creators to maximize your daily rewards
  </>,
]

const rewardsPerPost = '1000'
const rewardsPerComment = '100'

const EarnInfoByCretor = () => {
  const sendEvent = useSendEvent()
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
      title: 'Possible rewards per comment:',
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
        href='https://grillapp.net/posts/new'
        target='_blank'
        size={isTouchDevice() ? 'md' : 'lg'}
        className={cx('w-fit self-center', {
          ['border-text-primary text-text-primary']: isLockedTokens,
        })}
        onClick={() => sendEvent('cs_start_posting_clicked')}
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
