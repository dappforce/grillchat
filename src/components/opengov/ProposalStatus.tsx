import { Proposal } from '@/pages/api/opengov/proposals'
import { cx } from '@/utils/class-names'

const proposalsClassNameMap: Record<string, string> = {
  Confirming: cx('text-[#5EC269]'),
  Approved: cx('text-[#5EC269]'),
  Executed: cx('text-[#5EC269]'),
  TimedOut: cx('text-text-muted'),
  Rejected: cx('text-text-red'),
  Deciding: cx('text-[#847FE8]'),
  Preparing: cx('text-[#2196f3]'),
}
export default function ProposalStatus({ proposal }: { proposal: Proposal }) {
  return (
    <span
      className={cx(
        proposalsClassNameMap[proposal.status] ?? 'text-text-muted',
        'font-medium'
      )}
    >
      {proposal.status}
    </span>
  )
}
