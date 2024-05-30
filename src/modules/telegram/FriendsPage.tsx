import Button from '@/components/Button'
import Card from '@/components/Card'
import { Skeleton } from '@/components/SkeletonFallback'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useIsMounted from '@/hooks/useIsMounted'
import { getUserReferralsQuery } from '@/services/datahub/leaderboard/query'
import { useMyMainAddress } from '@/stores/my-account'
import { getCurrentUrlOrigin } from '@/utils/links'
import { copyToClipboard, formatNumber } from '@/utils/strings'
import { useState } from 'react'
import urlJoin from 'url-join'

export default function FriendsPage() {
  const isMounted = useIsMounted()
  const myAddress = useMyMainAddress()
  const [isCopied, setIsCopied] = useState(false)
  const { data: referralData, isLoading } = getUserReferralsQuery.useQuery(
    myAddress || ''
  )
  const referralLink =
    isMounted && myAddress
      ? urlJoin(getCurrentUrlOrigin(), `?ref=${myAddress}`)
      : ''

  const onCopyClick = (text: string) => {
    copyToClipboard(text)

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <div className='flex flex-col gap-4 px-4 pt-4'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>
            Earn 10% of Friends Rewards
          </span>
          <span className='text-text-muted'>
            You receive 10% of the points your first-line friends earn, and 1%
            from their friends’ earnings.
          </span>
        </div>
        <Card className='flex items-center gap-4 bg-background-light px-4 py-2'>
          {isMounted && myAddress ? (
            <span className='line-clamp-1 break-all'>{referralLink}</span>
          ) : (
            <Skeleton className='w-20 flex-1' />
          )}
          <Button
            className='flex-shrink-0'
            onClick={() => onCopyClick(referralLink)}
            disabled={isCopied}
          >
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
        </Card>
        <Card className='flex flex-col gap-2 bg-background-light px-4'>
          <span className='text-4xl font-bold'>
            {referralData ? (
              <span>{formatNumber(referralData?.refCount)}</span>
            ) : (
              <Skeleton className='w-16' />
            )}
          </span>
          <span className='text-sm font-medium text-text-muted'>
            Friends Joined
          </span>
        </Card>
        <Card className='flex flex-col gap-2 bg-background-light px-4'>
          <span className='text-4xl font-bold'>
            {referralData ? (
              <span>{formatNumber(referralData?.pointsEarned)}</span>
            ) : (
              <Skeleton className='w-16' />
            )}
          </span>
          <span className='text-sm font-medium text-text-muted'>
            Points Earned
          </span>
        </Card>
      </div>
    </LayoutWithBottomNavigation>
  )
}
