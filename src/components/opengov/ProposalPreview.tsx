import Send from '@/assets/icons/send.svg'
import { Proposal } from '@/pages/api/opengov/proposals'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { FaRegComment } from 'react-icons/fa6'
import AddressAvatar from '../AddressAvatar'
import Button from '../Button'
import Name from '../Name'
import ProfilePreview from '../ProfilePreview'
import ProposalStatus from './ProposalStatus'
import VoteSummary from './VoteSummary'

export default function ProposalPreview({ proposal }: { proposal: Proposal }) {
  return (
    <div className={cx('rounded-2xl bg-background-light p-4')}>
      <div className='flex flex-col'>
        <ProfilePreview
          withPolkadotIdentity
          address={proposal.proposer}
          showAddress={false}
          className='gap-1'
          nameClassName='text-sm text-text-muted'
          avatarClassName='h-5 w-5'
        />
        <span className='mt-1'>
          <span className='text-text-muted'>#</span>
          {proposal.id} &middot; {proposal.title}
        </span>

        <div className='my-4 grid grid-cols-[1fr_2fr] gap-4 rounded-2xl border border-border-gray px-4 pb-4 pt-3 text-sm md:grid-cols-[2fr_3fr]'>
          <div className='flex flex-col gap-2 border-r border-border-gray'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-text-muted'>Status</span>
              <ProposalStatus proposal={proposal} />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-text-muted'>Comments</span>
              <span>13</span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-8'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-text-muted'>Requested</span>
                <span>
                  {formatBalanceWithDecimals(proposal.requested, {
                    precision: 2,
                  })}{' '}
                  DOT
                </span>
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-text-muted'>Voted</span>
                <span>
                  {formatBalanceWithDecimals(proposal.vote.total, {
                    precision: 2,
                  })}{' '}
                  DOT
                </span>
              </div>
            </div>
            <VoteSummary proposal={proposal} />
          </div>
        </div>
        {/* <NoComments proposal={proposal} /> */}
        <LastCommentItem proposal={proposal} />
      </div>
    </div>
  )
}

function NoComments({ proposal }: { proposal: Proposal }) {
  // TODO: IF NO ADDRESS
  const myAddress = useMyMainAddress()

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <AddressAvatar address={myAddress ?? ''} />
        <span className='text-text-muted'>Write a comment...</span>
      </div>
      <Button
        size='circle'
        variant='mutedOutline'
        className='opacity-100'
        disabled
      >
        <Send />
      </Button>
    </div>
  )
}

function LastCommentItem({ proposal }: { proposal: Proposal }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <AddressAvatar address={proposal.proposer} />
        <div className='flex flex-col items-start gap-0.5'>
          <span className='flex items-center gap-2'>
            <Name
              withPolkadotIdentity
              className='text-sm'
              address={proposal.proposer}
            />
            <span className='text-xs text-text-muted'>2h ago</span>
          </span>
          <span>Nice!</span>
        </div>
      </div>
      <Button
        variant='transparent'
        size='sm'
        className='flex items-center gap-2 text-sm text-text-primary'
      >
        <FaRegComment className='relative top-px' />
        <span>Discuss</span>
      </Button>
    </div>
  )
}
