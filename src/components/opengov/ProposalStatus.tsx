import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import dayjs from 'dayjs'
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

function getRelativeTime(endDate: number) {
  const end = dayjs(endDate).diff(dayjs(), 'seconds')
  if (end > 24 * 60 * 60) {
    const diff = Math.round(dayjs(endDate).diff(dayjs(), 'days', true))
    const diffHours =
      Math.round(dayjs(endDate).diff(dayjs(), 'hours', true)) % 24
    return `${diff} day${diff > 1 ? 's' : ''} ${diffHours} hour${
      diffHours > 1 ? 's' : ''
    }`
  } else if (end > 60 * 60) {
    const diff = Math.round(dayjs(endDate).diff(dayjs(), 'hours', true))
    return `${diff} hour${diff > 1 ? 's' : ''}`
  }
  const diff = Math.round(dayjs(endDate).diff(dayjs(), 'minutes', true))
  return `${diff} minute${diff > 1 ? 's' : ''}`
}
function ProposalPeriodLeft({ proposal }: { proposal: Proposal }) {
  let element: ReactNode = null
  if (proposal.status === 'Deciding') {
    const endTime = proposal.decision?.endTime
    if (endTime) element = <span>{getRelativeTime(endTime)}</span>
  } else if (proposal.status === 'Confirming') {
    const endTime = proposal.confirmation?.endTime
    if (endTime) element = <span>{getRelativeTime(endTime)}</span>
  }
  return <> &middot; {element}</>
}
