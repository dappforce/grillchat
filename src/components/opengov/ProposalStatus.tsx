import { Proposal } from '@/pages/api/opengov/proposals'
import { cx } from '@/utils/class-names'

const proposalsClassNameMap: Record<string, { text: string; bg: string }> = {
  Confirming: { text: cx('text-[#5EC269]'), bg: cx('bg-[#5EC26914]') },
  Approved: { text: cx('text-[#5EC269]'), bg: cx('bg-[#5EC26914]') },
  Executed: { text: cx('text-[#5EC269]'), bg: cx('bg-[#5EC26914]') },
  TimedOut: { text: cx('text-text-muted'), bg: cx('bg-text-muted/20') },
  Rejected: { text: cx('text-text-red'), bg: cx('bg-text-red/20') },
  Deciding: { text: cx('text-[#847FE8]'), bg: cx('bg-[#847FE814]') },
  Preparing: { text: cx('text-[#2196f3]'), bg: cx('bg-[#2196f314]') },
}
export default function ProposalStatus({
  proposal,
  withBg,
  className,
}: {
  proposal: Proposal
  withBg?: boolean
  className?: string
}) {
  return (
    <span
      className={cx(
        proposalsClassNameMap[proposal.status].text ?? 'text-text-muted',
        'font-medium',
        withBg &&
          cx(
            proposalsClassNameMap[proposal.status].bg,
            'rounded-full px-2.5 py-0.5 font-normal'
          ),
        className
      )}
    >
      {proposal.status}
    </span>
  )
}
