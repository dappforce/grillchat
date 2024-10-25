import IssuanceIcon from '@/assets/icons/issuance.svg'
import SupportIcon from '@/assets/icons/support.svg'
import VoteIcon from '@/assets/icons/vote.svg'
import ActionCard from '@/components/ActionCard'
import Button from '@/components/Button'
import Card from '@/components/Card'
import PopOver from '@/components/floating/PopOver'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import {
  Proposal,
  ProposalConfirmationPeriod,
  ProposalDecisionPeriod,
} from '@/old/server/opengov/mapper'
import { getPostMetadataQuery } from '@/old/services/datahub/posts/query'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import ProposalMetadataModal from './ProposalMetadataModal'
import SupportBar, { getCurrentBillPercentage } from './SupportBar'

export default function ProposalStatusCard({
  proposal,
  onCommentButtonClick,
  chatId,
}: {
  proposal: Proposal
  onCommentButtonClick?: () => void
  chatId: string
}) {
  const { data: postMetadata, isLoading } = getPostMetadataQuery.useQuery(
    chatId ?? ''
  )
  const [isOpenModal, setIsOpenModal] = useState(false)
  const currentSupport = getCurrentBillPercentage(proposal)

  const isLoadingMetadata = isLoading && !!chatId

  const totalComment = isLoadingMetadata
    ? 0
    : (postMetadata?.totalCommentsCount ?? 0) + proposal.comments.length

  return (
    <Card className='flex flex-col gap-4 bg-background-light'>
      <div className='flex items-center justify-between gap-4'>
        <span className='text-lg font-medium'>Status</span>
        <ProposalStatus withBg proposal={proposal} />
      </div>
      <div className='flex items-center gap-4'>
        <VoteSummary size='large' className='h-20 w-20' proposal={proposal} />
        <div className='flex w-full flex-col'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1'>
              <FaCheck className='relative top-px text-base text-[#5EC269]' />
              <span>
                Aye{' '}
                <span className='text-text-muted'>
                  ({proposal.tally.ayesCount ?? 0})
                </span>
              </span>
            </div>
            <span>{formatBalanceWithDecimals(proposal.tally.ayes)} DOT</span>
          </div>
          <div className='my-3 w-full border-b border-border-gray/70' />
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1'>
              <FaXmark className='relative top-px text-base text-text-red' />
              <span>
                Nay{' '}
                <span className='text-text-muted'>
                  ({proposal.tally.naysCount ?? 0})
                </span>
              </span>
            </div>
            <span>{formatBalanceWithDecimals(proposal.tally.nays)} DOT</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <StatusProgressBar periodData={proposal.decision} title='Decision' />
        <StatusProgressBar
          periodData={proposal.confirmation}
          title='Confirmation'
        />
        <SupportBar proposal={proposal} />
      </div>
      <div className='flex flex-col gap-2.5'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <SupportIcon className='text-text-muted' />
            <span>Support</span>
            {currentSupport && (
              <span className='text-text-muted'>({currentSupport})</span>
            )}
          </div>
          <span>≈ {formatBalanceWithDecimals(proposal.tally.support)} DOT</span>
        </div>
        <div className='w-full border-b border-border-gray/70' />
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <IssuanceIcon className='text-text-muted' />
            <span>Issuance</span>
          </div>
          <span>
            ≈ {formatBalanceWithDecimals(proposal.tally.electorate)} DOT
          </span>
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
            className: 'border-border-gray dark:border-background-lightest',
          },
          {
            icon: (className) => (
              <HiOutlineInformationCircle
                className={cx('text-text-muted', className)}
              />
            ),
            text: 'Show Details',
            onClick: () => setIsOpenModal(true),
            className: 'border-border-gray dark:border-background-lightest',
          },
        ]}
        size='sm'
      />
      {onCommentButtonClick && (
        <Button
          size='lg'
          onClick={() => onCommentButtonClick()}
          className='w-full'
        >
          {!totalComment ? '' : totalComment} Comments
        </Button>
      )}
      <ProposalMetadataModal
        proposal={proposal}
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      />
    </Card>
  )
}

function getProposalPeriodStatus(period: {
  startTime: number
  endTime: number
  duration: number
}) {
  let periodDuration = dayjs.duration(period.duration).asDays()
  let periodDurationType: 'd' | 'm' | 'h' = 'd'
  const periodPercentage =
    (dayjs().diff(period.startTime) / period.duration) * 100
  const daysLeft = dayjs(period.endTime).diff(dayjs(), 'days')
  const hoursLeft = dayjs(period.endTime).diff(dayjs(), 'hours') % 24

  if (periodDuration < 1) {
    periodDuration = dayjs.duration(period.duration).asHours()
    periodDurationType = 'h'
    if (periodDuration < 1) {
      periodDuration = dayjs.duration(period.duration).asMinutes()
      periodDurationType = 'm'
    }
  }
  const currentDay = Math.min(
    dayjs().diff(period.startTime, periodDurationType),
    periodDuration
  )

  return {
    duration: periodDuration,
    durationType: periodDurationType,
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
  periodData: ProposalDecisionPeriod | ProposalConfirmationPeriod | null
}) {
  if (!periodData || !('startTime' in periodData)) return null
  const {
    currentDayElapsed,
    duration,
    durationType,
    percentage,
    daysLeft,
    hoursLeft,
  } = getProposalPeriodStatus(periodData)
  const percentageFixed = parseInt(percentage.toString())

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-4'>
        <span className='text-text-muted'>{title}</span>
        <span>
          <span className='text-text-muted'>{currentDayElapsed} / </span>
          {duration}
          {durationType}
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
              gridTemplateColumns: `${percentageFixed}fr ${
                100 - percentageFixed
              }fr`,
            }}
          >
            <div className='h-full rounded-full bg-background-primary' />
          </div>
        }
      >
        <span>
          {percentageFixed}%, {daysLeft > 0 ? `${daysLeft}d ` : ''}
          {hoursLeft}h left
        </span>
      </PopOver>
    </div>
  )
}
