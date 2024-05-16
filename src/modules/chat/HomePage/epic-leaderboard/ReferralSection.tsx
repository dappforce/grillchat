import Button from '@/components/Button'
import Card from '@/components/Card'
import { getUserReferralsQuery } from '@/services/datahub/leaderboard/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { copyToClipboard } from '@/utils/strings'
import { useMemo, useState } from 'react'
import SkeletonFallback from '../../../../components/SkeletonFallback'
import epicConfig from '../../../../constants/config/epic'

const { tokenSymbol } = epicConfig

const ReferralSection = () => {
  const myAddress = useMyMainAddress()
  const [isCopied, setIsCopied] = useState(false)

  const { data: refsCount, isLoading } = getUserReferralsQuery.useQuery(
    myAddress || ''
  )

  const onCopyClick = (text: string) => {
    copyToClipboard(text)

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const origin = useMemo(() => window.location.origin, [])

  const referralLink = `${origin}?ref=${myAddress}`

  return (
    <Card className='flex flex-col gap-2 bg-background-light'>
      <div className='flex items-center justify-between gap-2'>
        <span className='font-semibold'>Earn With Friends</span>
        {(refsCount || isLoading) && (
          <SkeletonFallback isLoading={isLoading}>
            <span className={cx('font-medium', mutedTextColorStyles)}>
              {refsCount} joined
            </span>
          </SkeletonFallback>
        )}
      </div>
      <p className='text-sm text-text-muted'>
        Earn ${tokenSymbol} when your friends join Epic using your link:
      </p>
      <div className='flex items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50 p-2'>
        <span className='flex-[1] overflow-hidden text-ellipsis whitespace-nowrap'>
          {referralLink}
        </span>
        <Button
          variant='primaryOutline'
          onClick={() => onCopyClick(referralLink)}
          size={'xs'}
          className='!p-0 !px-3 !py-1 leading-none'
        >
          {isCopied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </Card>
  )
}

export default ReferralSection
