import ProfilePreview from '@/components/ProfilePreview'
import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'

export default function ProposerSummary({
  proposal,
  className,
}: {
  proposal: Proposal
  className?: string
}) {
  return (
    <div className={cx('flex items-center justify-between gap-6', className)}>
      <div className='flex flex-shrink-0 items-center gap-2'>
        <span className='whitespace-nowrap'>
          {formatBalanceWithDecimals(proposal.requested)} DOT
        </span>
        <span className='whitespace-nowrap text-text-muted'>≈$3,567.34</span>
      </div>
      <ProfilePreview
        withPolkadotIdentity
        address={proposal.proposer}
        showAddress={false}
        className='gap-1'
        nameClassName='text-sm text-text-muted [&_span]:line-clamp-1'
        avatarClassName='h-5 w-5'
      />
    </div>
  )
}
