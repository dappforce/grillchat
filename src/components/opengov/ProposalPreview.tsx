import Reply from '@/assets/icons/reply.svg'
import Send from '@/assets/icons/send.svg'
import { env } from '@/env.mjs'
import { Proposal } from '@/server/opengov/mapper'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import AddressAvatar, { IdenticonAvatar } from '../AddressAvatar'
import Button from '../Button'
import LinkText from '../LinkText'
import Name from '../Name'
import ProfilePreview from '../ProfilePreview'
import { Skeleton } from '../SkeletonFallback'
import ChatLastMessage from '../chats/ChatPreview/ChatLastMessage'
import CustomLink from '../referral/CustomLink'
import ProposalStatus from './ProposalStatus'
import VoteSummary from './VoteSummary'

export default function ProposalPreview({
  proposal,
  className,
}: {
  proposal: Proposal
  className?: string
}) {
  return (
    <div className={cx('rounded-2xl bg-background-light p-4', className)}>
      <div className='flex h-full flex-col justify-between'>
        <div className='flex flex-col'>
          <ProfilePreview
            withPolkadotIdentity
            address={proposal.proposer}
            showAddress={false}
            className='gap-1'
            nameClassName='text-sm text-text-muted'
            avatarClassName='h-5 w-5'
          />
          <LinkText href={`/opengov/${proposal.id}`} className='mt-1'>
            <span className='text-text-muted'>#</span>
            {proposal.id} &middot; {proposal.title}
          </LinkText>
        </div>

        <div className='mb-3 mt-4 grid grid-cols-[1fr_2fr] gap-4 rounded-2xl border border-border-gray px-4 pb-4 pt-3 text-sm md:grid-cols-[2fr_3fr]'>
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
                  {formatBalanceWithDecimals(proposal.tally.support, {
                    precision: 2,
                  })}{' '}
                  DOT
                </span>
              </div>
            </div>
            <VoteSummary proposal={proposal} />
          </div>
        </div>
        <div>
          <CommentsSection proposal={proposal} />
        </div>
      </div>
    </div>
  )
}

function CommentsSection({ proposal }: { proposal: Proposal }) {
  const { data: postMetadata, isLoading: isLoadingLatestComment } =
    getPostMetadataQuery.useQuery(proposal.chatId ?? '', {
      enabled: !!proposal.chatId,
    })
  const lastCommentId = postMetadata?.lastCommentId
  const { data: message } = getPostQuery.useQuery(lastCommentId ?? '', {
    enabled: !!lastCommentId,
  })

  if (!proposal.chatId) {
    return <NoComments proposal={proposal} />
  }
  if (isLoadingLatestComment) {
    return (
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9' />
          <Skeleton className='w-16' />
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
  if (!postMetadata?.postId) {
    return <NoComments proposal={proposal} />
  }

  return (
    <LastCommentItem
      proposal={proposal}
      summary={postMetadata.summary}
      createdAtTime={postMetadata.createdAtTime}
      ownerId={message?.struct.ownerId}
    />
  )
}

function NoComments({ proposal }: { proposal: Proposal }) {
  const myAddress = useMyMainAddress()

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {myAddress ? (
          <AddressAvatar address={myAddress ?? ''} className='flex-shrink-0' />
        ) : (
          <IdenticonAvatar
            // just a random address to display random identicon for unlogged in user
            value='5Fv4YbSn89Fj92zDJAH583mH3r8hKkxdQJwHod28ZgVNcoym'
            className='h-9 w-9 flex-shrink-0'
          />
        )}
        <LinkText href={`/opengov/${proposal.id}`} className='w-full'>
          <span className='text-text-muted'>Write a comment...</span>
        </LinkText>
      </div>
      <Button
        size='circle'
        variant='mutedOutline'
        disabled
        disabledStyle='subtle'
      >
        <Send />
      </Button>
    </div>
  )
}

function LastCommentItem({
  proposal,
  summary,
  createdAtTime,
  ownerId,
}: {
  proposal: Proposal
  summary: string
  ownerId?: string
  createdAtTime?: number
}) {
  if (!proposal.chatId) return null

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {ownerId ? (
          <AddressAvatar address={proposal.proposer} />
        ) : (
          <Skeleton className='h-9 w-9' />
        )}
        <div className='flex flex-col items-start gap-0.5'>
          <span className='flex items-center gap-2'>
            {ownerId ? (
              <Name
                withPolkadotIdentity
                className='text-sm'
                address={ownerId}
              />
            ) : (
              <Skeleton className='w-12' />
            )}
            <span className='text-xs text-text-muted'>
              {createdAtTime ? getTimeRelativeToNow(createdAtTime) : ''}
            </span>
          </span>
          <ChatLastMessage
            className='text-base text-text'
            chatId={proposal.chatId}
            defaultDesc={summary}
            hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
          />
        </div>
      </div>
      <CustomLink href={`/opengov/${proposal.id}`}>
        <Button
          variant='primaryOutline'
          size='circle'
          className='flex items-center gap-2 text-text-muted'
        >
          <Reply className='relative -top-0.5' />
        </Button>
      </CustomLink>
    </div>
  )
}
