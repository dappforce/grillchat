import ProfilePreview from '@/components/ProfilePreview'
import { Skeleton } from '@/components/SkeletonFallback'
import { Proposal } from '@/server/opengov/mapper'
import { getPriceQuery } from '@/services/subsocial/prices/query'
import { cx } from '@/utils/class-names'
import { formatBalance, formatBalanceWithDecimals } from '@/utils/formatBalance'

export default function ProposerSummary({
  proposal,
  className,
}: {
  proposal: Proposal
  className?: string
}) {
  const { data: price, isLoading } = getPriceQuery.useQuery('polkadot')
  const currentPrice = price?.current_price
  const total =
    parseFloat(
      formatBalanceWithDecimals(proposal.requested, { shorten: false })
    ) * parseFloat(currentPrice ?? '0')
  return (
    <div className={cx('flex items-center justify-between gap-6', className)}>
      <div className='flex flex-shrink-0 items-center gap-2'>
        <span className='whitespace-nowrap'>
          {formatBalanceWithDecimals(proposal.requested)} DOT
        </span>
        {isLoading ? (
          <Skeleton className='w-24' />
        ) : (
          total > 0 && (
            <span className='whitespace-nowrap text-text-muted'>
              ≈${formatBalance({ value: total.toString() })}
            </span>
          )
        )}
      </div>
      <ProfilePreview
        withPolkadotIdentity
        address={proposal.proposer}
        showAddress={false}
        className='gap-1'
        nameClassName='text-text-muted [&_span]:line-clamp-1'
        avatarClassName='h-6 w-6'
      />
    </div>
  )
}
