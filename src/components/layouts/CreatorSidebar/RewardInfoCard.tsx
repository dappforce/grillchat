import Diamond from '@/assets/graphics/creators/diamonds/diamond.svg'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import RewardInfo from './RewardInfo'

export default function RewardInfoCard() {
  const sendEvent = useSendEvent()
  return (
    <Card className='bg-background-light p-0'>
      <div className='relative overflow-hidden border-b border-border-gray p-4'>
        <div className='flex items-center justify-between gap-4'>
          <p className={cx('text-lg font-semibold')}>My Weekly Rewards</p>
        </div>
        <LinkText
          href='https://docs.subsocial.network/docs/basics/content-staking/content-staking'
          openInNewTab
          className='text-sm'
          variant='primary'
          onClick={() =>
            sendEvent('astake_banner_learn_more', {
              eventSource: 'rewardInfo',
            })
          }
        >
          How does this work?
        </LinkText>
        <Diamond className='absolute -right-3 -top-3 h-full w-[75px] object-contain' />
      </div>
      <div>
        <RewardInfo />
      </div>
    </Card>
  )
}
