import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import MdRenderer from '@/components/MdRenderer'
import ChatRoom from '@/components/chats/ChatRoom'
import { env } from '@/env.mjs'
import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import useIsMounted from '@/hooks/useIsMounted'
import useToastError from '@/hooks/useToastError'
import BottomPanel from '@/modules/chat/ChatPage/BottomPanel'
import { useCreateDiscussion } from '@/services/api/mutation'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { HiChevronUp } from 'react-icons/hi2'
import ExternalSourceChatRoom from './ExternalSourceChatRoom'
import ProposalDetailModal from './ProposalDetailModal'
import {
  ProposalDetailPageProps,
  getProposalResourceId,
} from './ProposalDetailPage'
import ProposalStatusCard from './ProposalStatusCard'
import ProposerSummary from './ProposerSummary'
import useCommentDrawer from './hooks/useCommentDrawer'

export default function MobileProposalDetailPage({
  proposal,
  chatId,
  className,
}: ProposalDetailPageProps & { className?: string }) {
  const isMounted = useIsMounted()
  const lgUp = useBreakpointThreshold('lg')

  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false)
  const { mutateAsync, error, isLoading } = useCreateDiscussion()
  useToastError(error, 'Failed to create discussion')

  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId ?? '')

  const { selectedTab, setSelectedTab, isOpen, setIsOpen } =
    useCommentDrawer(proposal)

  const [usedChatId, setUsedChatId] = useState(chatId)

  const createDiscussion = async function () {
    const { data } = await mutateAsync({
      spaceId: env.NEXT_PUBLIC_PROPOSALS_HUB,
      content: {
        title: proposal.title,
      },
      resourceId: getProposalResourceId(proposal.id),
    })
    if (data?.postId) {
      setUsedChatId(data.postId)
    }
  }

  return (
    <div
      className={cx('relative flex flex-1 flex-col overflow-hidden', className)}
    >
      <div
        className={cx(
          'absolute left-0 z-20 w-full bg-background transition',
          isOpen && 'pointer-events-none -translate-y-1/4 opacity-0'
        )}
      >
        <div className='h-[calc(100dvh_-_3.5rem)] overflow-auto px-4 pb-24 pt-4 scrollbar-none'>
          <div className={cx('flex flex-col gap-4', className)}>
            <ProposerSummary proposal={proposal} />
            <Card className='flex flex-col items-start gap-4 bg-background-light'>
              <h1 className='font-bold'>
                #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
                {proposal.title}
              </h1>
              <MdRenderer
                className='prose-sm line-clamp-6'
                removeEmptyParagraph
                source={proposal.content}
              />
              <LinkText
                variant='secondary'
                href={`/opengov/${proposal.id}#detail`}
                shallow
                onClick={() => setIsOpenDetailModal(true)}
              >
                Read more
              </LinkText>
            </Card>
            <ProposalStatusCard proposal={proposal} />
          </div>
        </div>
        <div className='container-page absolute bottom-0 h-20 w-full border-t border-border-gray bg-background-light py-4'>
          <Button size='lg' className='w-full' onClick={() => setIsOpen(true)}>
            Comment{' '}
            {postMetadata?.totalCommentsCount
              ? `(${postMetadata.totalCommentsCount})`
              : ''}
          </Button>
        </div>
      </div>

      <div className='grid w-full grid-cols-2 gap-2 border-b border-border-gray bg-background-light px-2 py-1.5'>
        <Button
          size='noPadding'
          variant='transparent'
          className={cx(
            'flex items-center justify-center gap-1 rounded-lg py-1 text-sm',
            selectedTab === 'grill' && 'bg-background-primary text-white'
          )}
          interactive='none'
          onClick={() => setSelectedTab('grill')}
        >
          <span>Grill</span>
        </Button>
        <Button
          size='noPadding'
          variant='transparent'
          className={cx(
            'flex items-center justify-center gap-1 rounded-lg py-1 text-sm',
            selectedTab === 'others' && 'bg-background-primary text-white'
          )}
          interactive='none'
          onClick={() => setSelectedTab('others')}
        >
          <span>Other Sources</span>
        </Button>
      </div>
      <div className='relative z-10 w-full'>
        <div className='absolute left-1/2 top-2 -translate-x-1/2'>
          <Button
            size='noPadding'
            variant='transparent'
            className='flex items-center justify-center gap-2 bg-background-light p-1.5 px-4 text-sm text-text-muted'
            interactive='none'
            onClick={() => setIsOpen(false)}
          >
            <span>Back to proposal</span>
            <HiChevronUp />
          </Button>
        </div>
      </div>
      {/* To not render double chat rooms with the desktop, which can cause issue with chat item menu */}
      {isMounted && !lgUp && selectedTab === 'grill' ? (
        <ChatRoom
          chatId={usedChatId ?? ''}
          hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
          asContainer
          customAction={
            !usedChatId ? (
              <Button
                size='lg'
                onClick={createDiscussion}
                isLoading={isLoading}
              >
                Start Discussion
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ExternalSourceChatRoom
          comments={proposal.comments}
          switchToGrillTab={() => setSelectedTab('grill')}
        />
      )}
      <BottomPanel />
      <ProposalDetailModal
        isOpen={isOpenDetailModal}
        closeModal={() => setIsOpenDetailModal(false)}
        proposal={proposal}
      />
    </div>
  )
}
