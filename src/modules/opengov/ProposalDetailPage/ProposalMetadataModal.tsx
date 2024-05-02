import LinkText from '@/components/LinkText'
import ProfilePreview from '@/components/ProfilePreview'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { Proposal } from '@/server/opengov/mapper'
import { getDurationWithPredefinedUnit } from '@/utils/date'
import { formatBalance, formatBalanceWithDecimals } from '@/utils/formatBalance'
import { getSubsquareUserProfileLink } from '@/utils/links'
import { ReactNode } from 'react'

export default function ProposalMetadataModal({
  proposal,
  ...props
}: ModalFunctionalityProps & { proposal: Proposal }) {
  const metadata = proposal.metadata

  return (
    <Modal {...props} title='Metadata' withCloseButton>
      <div className='flex flex-col gap-3'>
        {metadata.submissionDeposit && (
          <MetadataItem title='Submission'>
            <div className='flex items-center gap-1.5'>
              <LinkText
                href={getSubsquareUserProfileLink(
                  metadata.submissionDeposit.who
                )}
                openInNewTab
              >
                <ProfilePreview
                  address={metadata.submissionDeposit.who}
                  withPolkadotIdentity
                  showAddress={false}
                  className='gap-1'
                  avatarClassName='h-5 w-5'
                />
              </LinkText>
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
        <div className='w-full border-b border-border-gray/70' />
        {metadata.decisionDeposit && (
          <MetadataItem title='Decision'>
            <div className='flex items-center gap-1.5'>
              <LinkText
                href={getSubsquareUserProfileLink(metadata.decisionDeposit.who)}
                openInNewTab
              >
                <ProfilePreview
                  address={metadata.decisionDeposit.who}
                  withPolkadotIdentity
                  showAddress={false}
                  className='gap-1'
                  avatarClassName='h-5 w-5'
                />
              </LinkText>
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
        <div className='w-full border-b border-border-gray/70' />
        {metadata.decisionPeriod && (
          <>
            <MetadataItem title='Decision Period'>
              <span>
                {
                  getDurationWithPredefinedUnit(metadata.decisionPeriod.time)
                    .text
                }{' '}
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
            <div className='w-full border-b border-border-gray/70' />
          </>
        )}
        {metadata.confirmingPeriod && (
          <>
            <MetadataItem title='Confirming Period'>
              <span>
                {
                  getDurationWithPredefinedUnit(metadata.confirmingPeriod.time)
                    .text
                }{' '}
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
            <div className='w-full border-b border-border-gray/70' />
          </>
        )}
        {metadata.enact && (
          <>
            <MetadataItem title='Enact'>
              <span>After: {metadata.enact.block}</span>
            </MetadataItem>
            <div className='w-full border-b border-border-gray/70' />
          </>
        )}
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
