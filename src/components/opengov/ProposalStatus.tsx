import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { getDurationWithPredefinedUnit } from '@/utils/date'
import { ReactNode } from 'react'

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
      <ProposalPeriodLeft proposal={proposal} />
    </span>
  )
}

function getRelativeTime(timeLeft: number) {
  const { duration, unit } = getDurationWithPredefinedUnit(timeLeft)
  let unitShort = ''
  if (unit === 'days') unitShort = 'd'
  if (unit === 'hours') unitShort = 'h'
  if (unit === 'minutes') unitShort = 'm'
  return `${duration}${unitShort}`
}
function ProposalPeriodLeft({ proposal }: { proposal: Proposal }) {
  let element: ReactNode = null
  if (proposal.status === 'Deciding') {
    const timeLeft = proposal.decision?.timeLeft
    if (timeLeft) element = <span>{getRelativeTime(timeLeft)}</span>
  } else if (proposal.status === 'Confirming' && proposal.confirmation) {
    if ('timeLeft' in proposal.confirmation)
      element = <span>{getRelativeTime(proposal.confirmation.timeLeft)}</span>
  }
  if (!element) return null
  return <> &middot; {element}</>
}
