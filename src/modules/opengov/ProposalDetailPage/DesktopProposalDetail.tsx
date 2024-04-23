import Button from '@/components/Button'
import Card from '@/components/Card'
import MdRenderer from '@/components/MdRenderer'
import { Skeleton } from '@/components/SkeletonFallback'
import ChatItemContainer from '@/components/chats/ChatList/ChatItemContainer'
import ChatRoom from '@/components/chats/ChatRoom'
import { WriteFirstComment } from '@/components/opengov/ProposalPreview'
import { env } from '@/env.mjs'
import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import useIsMounted from '@/hooks/useIsMounted'
import { useStickyElement } from '@/hooks/useStickyElement'
import { Proposal } from '@/server/opengov/mapper'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { estimatedWaitTime } from '@/utils/network'
import { PostData } from '@subsocial/api/types'
import { memo, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import ExternalChatItem from './ExternalChatItem'
import ExternalSourceChatRoom from './ExternalSourceChatRoom'
import { ProposalDetailPageProps } from './ProposalDetailPage'
import ProposalStatusCard from './ProposalStatusCard'
import ProposerSummary from './ProposerSummary'
import { useProposalDetailContext } from './context'
import useCommentDrawer, { CommentDrawerTab } from './hooks/useCommentDrawer'

export default function DesktopProposalDetail({
  proposal,
  className,
}: ProposalDetailPageProps & { className?: string }) {
  const { chatId } = useProposalDetailContext()
  const { allIds, isOpen, isLoading, selectedTab, setIsOpen, setSelectedTab } =
    useCommentDrawer(proposal)

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = 'visible'
    }

    return () => {
      document.documentElement.style.overflow = 'visible'
    }
  }, [isOpen])

  return (
    <>
      <div
        className={cx(
          'container-page grid grid-cols-[2fr_1fr] gap-6 pt-4',
          className
        )}
      >
        <div className='mb-8 flex flex-col gap-4'>
          <ProposerSummary proposal={proposal} />
          <Card className='flex flex-col items-start gap-2 bg-background-light'>
            <div className='flex w-full items-center justify-between gap-4'>
              <h1 className='text-xl font-bold'>
                #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
                {proposal.title}
              </h1>
            </div>
            <MdRenderer
              className='max-w-full break-words'
              removeEmptyParagraph
              source={proposal.content}
            />
          </Card>
        </div>
        <StickyRightPanel
          proposal={proposal}
          chatId={chatId}
          allIds={allIds}
          isLoading={isLoading}
          setIsOpen={setIsOpen}
        />
      </div>
      <SidePanel
        isLoading={isLoading}
        proposal={proposal}
        hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </>
  )
}

function StickyRightPanel({
  proposal,
  chatId,
  allIds,
  isLoading,
  setIsOpen,
}: {
  proposal: Proposal
  chatId: string
  allIds: string[]
  isLoading: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId ?? '')
  const lastThreeMessageIds = allIds.slice(0, 3)
  const lastThreeMessages = getPostQuery.useQueries(lastThreeMessageIds)
  const isLoadingMessages = useIsAnyQueriesLoading(lastThreeMessages)

  const ref = useRef<HTMLDivElement | null>(null)
  const style = useStickyElement({ elRef: ref, top: 72 })

  const hasGrillComments = !isLoading && allIds.length > 0

  return (
    <div
      className='flex flex-col gap-6 self-start pb-8'
      style={style}
      ref={ref}
    >
      <ProposalStatusCard proposal={proposal} />
      <Card className='flex flex-col gap-4 bg-background-light'>
        <span className='text-lg font-bold'>Latest Comments</span>
        {(() => {
          if (isLoading || isLoadingMessages) {
            return (
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-full' />
                <Skeleton className='w-full' />
                <Skeleton className='w-full' />
              </div>
            )
          }
          if (!hasGrillComments && proposal.comments.length) {
            return (
              <LatestCommentFromExternalSources
                setIsOpenDrawer={setIsOpen}
                proposal={proposal}
              />
            )
          }
          if (hasGrillComments && chatId) {
            return (
              <GrillLatestMessages
                lastThreeMessages={lastThreeMessages}
                chatId={chatId}
                setIsOpenDrawer={setIsOpen}
                totalCommentsCount={postMetadata?.totalCommentsCount || 0}
              />
            )
          }
          return <NoMessagesCard onClick={() => setIsOpen(true)} />
        })()}
      </Card>
    </div>
  )
}

function LatestCommentFromExternalSources({
  proposal,
  setIsOpenDrawer,
}: {
  proposal: Proposal
  setIsOpenDrawer: (isOpen: boolean) => void
}) {
  const lastThreeComments = proposal.comments.slice(0, 3).toReversed()
  const length = proposal.comments.length
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        {lastThreeComments.map((comment) => {
          if (!comment.content) return
          return (
            <ExternalChatItem
              bg='background'
              proposal={proposal}
              comment={comment}
              key={comment.id}
            />
          )
        })}
      </div>
      <Button
        size='lg'
        onClick={() => setIsOpenDrawer(true)}
        className='mt-auto w-full'
      >
        Show {length > 1 && 'all '}
        {length ? `${length} ` : ''} Comments
      </Button>
    </div>
  )
}

function GrillLatestMessages({
  lastThreeMessages,
  chatId,
  setIsOpenDrawer,
  totalCommentsCount,
}: {
  lastThreeMessages: { data: PostData | null | undefined }[]
  chatId: string
  setIsOpenDrawer: (isOpen: boolean) => void
  totalCommentsCount: number
}) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        {lastThreeMessages.map(({ data }) => {
          if (!data) return
          return (
            <ChatItemContainer
              bg='background'
              key={data.id}
              enableChatMenu={false}
              chatId={chatId}
              hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
              message={data}
            />
          )
        })}
      </div>
      <Button
        size='lg'
        onClick={() => setIsOpenDrawer(true)}
        className='mt-auto w-full'
      >
        Show all {totalCommentsCount ? `${totalCommentsCount} ` : ''}
        Comments
      </Button>
    </div>
  )
}

function NoMessagesCard({ onClick }: { onClick: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center gap-5'>
      <WriteFirstComment onClick={onClick} />
      <Button size='lg' onClick={onClick} className='mt-auto w-full'>
        Open Comments
      </Button>
    </div>
  )
}

const MemoizedExternalChatRoom = memo(ExternalSourceChatRoom)
function SidePanel({
  hubId,
  proposal,
  onClose,
  isOpen,
  setSelectedTab,
  selectedTab,
}: {
  hubId: string
  proposal: Proposal
  onClose?: () => void
  isOpen: boolean
  shouldDisplayExternalSourceAsDefault?: boolean
  isLoading: boolean
  selectedTab: CommentDrawerTab
  setSelectedTab: (tab: CommentDrawerTab) => void
}) {
  const isMounted = useIsMounted()
  const lgUp = useBreakpointThreshold('lg')

  const { chatId, isLoading, createDiscussion } = useProposalDetailContext()
  const { data, isLoading: isLoadingMetadata } =
    getPostMetadataQuery.useQuery(chatId)

  const switchToGrillCallback = useCallback(() => {
    setSelectedTab('grill')
  }, [setSelectedTab])

  // Should not render multiple chat rooms (along with the mobile one), because it will cause issue with chat item menu
  if (!isMounted || !lgUp) return null

  return createPortal(
    <>
      <div
        className={cx(
          'pointer-events-none fixed inset-0 z-[25] bg-black/70 opacity-0 transition',
          isOpen && 'pointer-events-auto opacity-100'
        )}
        onClick={onClose}
      />
      <div
        className={cx(
          'pointer-events-none fixed right-0 top-0 z-30 flex h-screen w-full max-w-[500px] translate-x-1/3 flex-col bg-[#eceff4] opacity-0 transition dark:bg-[#11172a]',
          isOpen && 'pointer-events-auto translate-x-0 opacity-100'
        )}
      >
        <Button
          size='circle'
          variant='bgLighter'
          className='absolute -left-2 top-2 -translate-x-full rounded-md'
          onClick={onClose}
        >
          <MdKeyboardDoubleArrowRight />
        </Button>
        <div className='flex items-center justify-between gap-4 bg-background-light px-2 py-2'>
          <span className='font-semibold'>Comments</span>
          <div className='flex whitespace-nowrap rounded-md bg-[#eceff4] text-sm font-medium text-text-muted dark:bg-[#11172a]'>
            <Button
              size='noPadding'
              variant='transparent'
              className={cx(
                'rounded-md rounded-r-none px-3 py-1.5',
                selectedTab === 'grill' && 'bg-background-primary text-white'
              )}
              onClick={() => setSelectedTab('grill')}
            >
              Grill
              {isLoadingMetadata ? '' : ` (${data?.totalCommentsCount ?? 0})`}
            </Button>
            <Button
              size='noPadding'
              variant='transparent'
              className={cx(
                'rounded-md rounded-l-none px-3 py-1.5',
                selectedTab === 'others' && 'bg-background-primary text-white'
              )}
              onClick={() => setSelectedTab('others')}
            >
              Other Sources ({proposal.comments.length ?? 0})
            </Button>
          </div>
        </div>
        {selectedTab === 'grill' ? (
          <ChatRoom
            chatId={chatId}
            hubId={hubId}
            asContainer
            customAction={
              !chatId ? (
                <Button
                  size='lg'
                  onClick={createDiscussion}
                  isLoading={isLoading}
                  loadingText={`Please wait, it may take up to ${estimatedWaitTime} seconds`}
                >
                  Start Discussion
                </Button>
              ) : undefined
            }
          />
        ) : (
          <MemoizedExternalChatRoom
            proposal={proposal}
            comments={proposal.comments}
            switchToGrillTab={switchToGrillCallback}
          />
        )}
      </div>
    </>,
    document.body
  )
}
