import LinkText from '@/components/LinkText'
import ProfilePreview from '@/components/ProfilePreview'
import { Skeleton } from '@/components/SkeletonFallback'
import { Proposal } from '@/old/server/opengov/mapper'
import { getPriceQuery } from '@/old/services/subsocial/prices/query'
import { cx } from '@/utils/class-names'
import { formatBalance, formatBalanceWithDecimals } from '@/utils/formatBalance'
import { getSubsquareUserProfileLink } from '@/utils/links'

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
      <div className='flex flex-shrink-0 flex-col gap-1'>
        <span className='text-sm text-text-muted'>Proposed by:</span>
        <LinkText
          href={getSubsquareUserProfileLink(proposal.proposer)}
          openInNewTab
        >
          <ProfilePreview
            withPolkadotIdentity
            address={proposal.proposer}
            showAddress={false}
            className='gap-1'
            nameClassName='text-text-muted text-base [&_span]:line-clamp-1'
            avatarClassName='h-5 w-5'
          />
        </LinkText>
      </div>
      <div className='flex flex-shrink-0 flex-col items-end gap-1'>
        <span className='text-sm text-text-muted'>Requested amount:</span>
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
      </div>
    </div>
  )
}
