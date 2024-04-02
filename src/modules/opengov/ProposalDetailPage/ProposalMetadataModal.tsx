import ProfilePreview from '@/components/ProfilePreview'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { Proposal } from '@/server/opengov/mapper'
import { getDurationWithPredefinedUnit } from '@/utils/date'
import { formatBalance, formatBalanceWithDecimals } from '@/utils/formatBalance'
import { ReactNode } from 'react'

export default function ProposalMetadataModal({
  proposal,
  ...props
}: ModalFunctionalityProps & { proposal: Proposal }) {
  const metadata = proposal.metadata

  const decisionDuration = getDurationWithPredefinedUnit(
    proposal.metadata.decisionPeriod.time
  )

  return (
    <Modal {...props} title='Metadata' withCloseButton>
      <div className='flex flex-col gap-3'>
        {metadata.submissionDeposit && (
          <MetadataItem title='Submission'>
            <div className='flex items-center gap-1.5'>
              <ProfilePreview
                address={metadata.submissionDeposit.who}
                withPolkadotIdentity
                showAddress={false}
                className='gap-1'
                avatarClassName='h-5 w-5'
              />
              <span>&middot;</span>
              <span>
                {formatBalanceWithDecimals(
                  metadata.submissionDeposit.amount.toString()
                )}{' '}
                DOT
              </span>
            </div>
          </MetadataItem>
        )}
        <div className='h-px w-full bg-border-gray/70' />
        {metadata.decisionDeposit && (
          <MetadataItem title='Decision'>
            <div className='flex items-center gap-1.5'>
              <ProfilePreview
                address={metadata.decisionDeposit.who}
                withPolkadotIdentity
                showAddress={false}
                className='gap-1'
                avatarClassName='h-5 w-5'
              />
              <span>&middot;</span>
              <span>
                {formatBalanceWithDecimals(
                  metadata.decisionDeposit.amount.toString()
                )}{' '}
                DOT
              </span>
            </div>
          </MetadataItem>
        )}
        <div className='h-px w-full bg-border-gray/70' />
        <MetadataItem title='Decision Period'>
          <span>
            {getDurationWithPredefinedUnit(metadata.decisionPeriod.time).text}{' '}
            <span className='text-text-muted'>
              (
              {formatBalance({
                value: metadata.decisionPeriod.block.toString(),
                defaultMaximumFractionDigits: 0,
              })}{' '}
              blocks)
            </span>
          </span>
        </MetadataItem>
        <div className='h-px w-full bg-border-gray/70' />
        <MetadataItem title='Confirming Period'>
          <span>
            {getDurationWithPredefinedUnit(metadata.confirmingPeriod.time).text}{' '}
            <span className='text-text-muted'>
              (
              {formatBalance({
                value: metadata.confirmingPeriod.block.toString(),
                defaultMaximumFractionDigits: 0,
              })}{' '}
              blocks)
            </span>
          </span>
        </MetadataItem>
        <div className='h-px w-full bg-border-gray/70' />
        <MetadataItem title='Enact'>
          <span>After: {metadata.enact.block}</span>
        </MetadataItem>
        <div className='h-px w-full bg-border-gray/70' />
        <MetadataItem title='Proposal Hash'>
          <span className='break-words'>{metadata.hash}</span>
        </MetadataItem>
      </div>
    </Modal>
  )
}

function MetadataItem({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-sm text-text-muted'>{title}</span>
      <div>{children}</div>
    </div>
  )
}
