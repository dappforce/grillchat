import IssuanceIcon from '@/assets/icons/issuance.svg'
import SupportIcon from '@/assets/icons/support.svg'
import VoteIcon from '@/assets/icons/vote.svg'
import ActionCard from '@/components/ActionCard'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import MdRenderer from '@/components/MdRenderer'
import ProfilePreview from '@/components/ProfilePreview'
import PopOver from '@/components/floating/PopOver'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import ProposalDetailModal from './ProposalDetailModal'

dayjs.extend(duration)

export default function ProposalDetailSection({
  proposal,
  className,
}: {
  proposal: Proposal
  className?: string
}) {
  return (
    <div className={cx('flex flex-col gap-4', className)}>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span>{formatBalanceWithDecimals(proposal.requested)} DOT</span>
          <span className='text-text-muted'>≈$3,567.34</span>
        </div>
        <ProfilePreview
          withPolkadotIdentity
          address={proposal.proposer}
          showAddress={false}
          className='gap-1'
          nameClassName='text-sm text-text-muted'
          avatarClassName='h-5 w-5'
        />
      </div>
      <Summary proposal={proposal} />
      <Status proposal={proposal} />
    </div>
  )
}

function Summary({ proposal }: { proposal: Proposal }) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  return (
    <>
      <Card className='flex flex-col items-start gap-6 bg-background-light'>
        <h1 className='font-bold'>
          #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
          {proposal.title}
        </h1>
        <MdRenderer className='line-clamp-6' source={proposal.content} />
        <LinkText
          variant='secondary'
          href={`/opengov/${proposal.id}#detail`}
          shallow
          onClick={() => setIsOpenModal(true)}
        >
          Read more
        </LinkText>
      </Card>
      <ProposalDetailModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        proposal={proposal}
      />
    </>
  )
}

function Status({ proposal }: { proposal: Proposal }) {
  return (
    <Card className='flex flex-col gap-4 bg-background-light'>
      <div className='flex items-center justify-between gap-4'>
        <span className='font-medium'>Status</span>
        <ProposalStatus withBg className='text-sm' proposal={proposal} />
      </div>
      <div className='flex items-center gap-6'>
        <VoteSummary cutout={34} className='h-20 w-20' proposal={proposal} />
        <div className='flex w-full flex-col'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1'>
              <FaCheck className='text-[#5EC269]' />
              <span className='text-sm'>
                Aye <span className='text-text-muted'>(125)</span>
              </span>
            </div>
            <span>{formatBalanceWithDecimals(proposal.vote.ayes)} DOT</span>
          </div>
          <div className='my-3 h-px w-full bg-border-gray/70' />
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1'>
              <FaX className='text-text-red' />
              <span className='text-sm'>
                Nay <span className='text-text-muted'>(125)</span>
              </span>
            </div>
            <span>{formatBalanceWithDecimals(proposal.vote.nays)} DOT</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <StatusProgressBar periodData={proposal.decision} title='Decision' />
        <StatusProgressBar
          periodData={proposal.confirmation}
          title='Confirmation'
        />
      </div>
      <div className='flex flex-col gap-2.5'>
        <div className='flex items-center justify-between gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <SupportIcon className='text-text-muted' />
            <span>Support</span>
            <span className='text-text-muted'>(0.1%/32.6%)</span>
          </div>
          <span>≈ 331.59k DOT</span>
        </div>
        <div className='h-px w-full bg-border-gray/70' />
        <div className='flex items-center justify-between gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <IssuanceIcon className='text-text-muted' />
            <span>Issuance</span>
          </div>
          <span>≈ 690.59k DOT</span>
        </div>
      </div>
      <ActionCard
        className='p-0'
        actions={[
          {
            icon: (className) => (
              <VoteIcon className={cx('text-text-muted', className)} />
            ),
            href: `https://polkadot.subsquare.io/referenda/${proposal.id}`,
            text: 'Vote',
            openInNewTab: true,
          },
          {
            icon: (className) => (
              <HiOutlineInformationCircle
                className={cx('text-text-muted', className)}
              />
            ),
            text: 'Show Details',
          },
        ]}
        size='sm'
      />
    </Card>
  )
}

function getProposalPeriodStatus(period: {
  startTime: number
  endTime: number
  duration: number
}) {
  const periodDuration = dayjs.duration(period.duration).asDays()
  const periodPercentage =
    (dayjs().diff(period.startTime) / period.duration) * 100
  const currentDay = dayjs().diff(period.startTime, 'days')
  const daysLeft = dayjs(period.endTime).diff(dayjs(), 'days')
  const hoursLeft = dayjs(period.endTime).diff(dayjs(), 'hours') % 24

  return {
    duration: periodDuration,
    percentage: periodPercentage,
    currentDayElapsed: currentDay,
    daysLeft,
    hoursLeft,
  }
}
function StatusProgressBar({
  periodData,
  title,
}: {
  title: string
  periodData: {
    startTime: number
    endTime: number
    duration: number
  } | null
}) {
  if (!periodData) return null
  const { currentDayElapsed, duration, percentage, daysLeft, hoursLeft } =
    getProposalPeriodStatus(periodData)
  const percentageFixed = parseInt(percentage.toString())

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-4 text-sm'>
        <span className='text-text-muted'>{title}</span>
        <span>
          <span className='text-text-muted'>{currentDayElapsed} / </span>
          {duration}d
        </span>
      </div>
      <PopOver
        triggerOnHover
        panelSize='sm'
        placement='top'
        yOffset={10}
        trigger={
          <div
            className='grid h-1.5 w-full rounded-full bg-background-lightest'
            style={{
              gridTemplateColumns: `${percentage}fr ${100 - percentageFixed}fr`,
            }}
          >
            <div className='h-full rounded-full bg-background-primary' />
          </div>
        }
      >
        <span>
          {percentageFixed}%, {daysLeft}d {hoursLeft}h left
        </span>
      </PopOver>
    </div>
  )
}
