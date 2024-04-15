import Button from '@/components/Button'
import Card from '@/components/Card'
import Container from '@/components/Container'
import MdRenderer from '@/components/MdRenderer'
import ScrollableContainer from '@/components/ScrollableContainer'
import { Skeleton } from '@/components/SkeletonFallback'
import ChatItem from '@/components/chats/ChatItem'
import ChatRoom from '@/components/chats/ChatRoom'
import usePaginatedMessageIds from '@/components/chats/hooks/usePaginatedMessageIds'
import { WriteFirstComment } from '@/components/opengov/ProposalPreview'
import { env } from '@/env.mjs'
import useToastError from '@/hooks/useToastError'
import { Proposal, ProposalComment } from '@/server/opengov/mapper'
import { useCreateDiscussion } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { Drawer } from 'vaul'
import ExternalChatItem from './ExternalChatItem'
import {
  ProposalDetailPageProps,
  getProposalResourceId,
} from './ProposalDetailPage'
import ProposalStatusCard from './ProposalStatusCard'
import ProposerSummary from './ProposerSummary'

export default function DesktopProposalDetail({
  chatId,
  proposal,
  className,
}: ProposalDetailPageProps & { className?: string }) {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId ?? '')
  const { allIds, isLoading } = usePaginatedMessageIds({
    chatId: chatId ?? '',
    hubId: env.NEXT_PUBLIC_PROPOSALS_HUB,
  })
  const lastThreeMessageIds = allIds.slice(0, 3)
  const lastThreeMessages = getPostQuery.useQueries(lastThreeMessageIds)
  const isLoadingMessages = useIsAnyQueriesLoading(lastThreeMessages)

  const hasGrillComments = !isLoading && allIds.length > 0

  return (
    <Drawer.Root
      direction='right'
      open={isOpenDrawer}
      onOpenChange={setIsOpenDrawer}
    >
      <div
        className={cx(
          'container-page grid grid-cols-[3fr_2fr] gap-6 pt-4',
          className
        )}
      >
        <div className='flex flex-col gap-4'>
          <ProposerSummary proposal={proposal} />
          <Card className='flex flex-col items-start gap-2 bg-background-light'>
            <div className='flex w-full items-center justify-between gap-4'>
              <h1 className='text-lg font-bold'>
                #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
                {proposal.title}
              </h1>
              <Button
                className='flex-shrink-0'
                onClick={() => setIsOpenDrawer(true)}
              >
                {postMetadata?.totalCommentsCount || ''} Comments
              </Button>
            </div>
            <MdRenderer
              className='max-w-full break-words'
              removeEmptyParagraph
              source={proposal.content}
            />
          </Card>
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
                    setIsOpenDrawer={setIsOpenDrawer}
                    proposal={proposal}
                  />
                )
              }
              if (hasGrillComments && chatId) {
                return (
                  <GrillLatestMessages
                    lastThreeMessages={lastThreeMessages}
                    chatId={chatId}
                    setIsOpenDrawer={setIsOpenDrawer}
                    totalCommentsCount={postMetadata?.totalCommentsCount || 0}
                  />
                )
              }
              return <NoMessagesCard onClick={() => setIsOpenDrawer(true)} />
            })()}
          </Card>
        </div>
        <div className='sticky top-20 self-start'>
          <ProposalStatusCard proposal={proposal} />
        </div>
      </div>
      <SidePanel
        proposal={proposal}
        chatId={chatId ?? ''}
        hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        shouldDisplayExternalSourceAsDefault={
          !hasGrillComments && !!proposal.comments.length
        }
      />
    </Drawer.Root>
  )
}

function LatestCommentFromExternalSources({
  proposal,
  setIsOpenDrawer,
}: {
  proposal: Proposal
  setIsOpenDrawer: (isOpen: boolean) => void
}) {
  const lastThreeComments = proposal.comments.slice(-3)
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        {lastThreeComments.map((comment) => {
          if (!comment.content) return
          return (
            <ExternalChatItem
              bg='background'
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
        Open Comments
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
  const myAddress = useMyMainAddress()
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        {lastThreeMessages.map(({ data }) => {
          if (!data) return
          return (
            <ChatItem
              bg='background'
              enableChatMenu={false}
              key={data.id}
              message={data}
              chatId={chatId}
              hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
              isMyMessage={data.struct.ownerId === myAddress}
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

function SidePanel({
  chatId,
  hubId,
  proposal,
  onClose,
  isOpen,
  shouldDisplayExternalSourceAsDefault,
}: {
  chatId: string
  hubId: string
  proposal: Proposal
  onClose?: () => void
  isOpen: boolean
  shouldDisplayExternalSourceAsDefault?: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<'grill' | 'others'>('grill')

  useEffect(() => {
    if (isOpen) {
      setSelectedTab(shouldDisplayExternalSourceAsDefault ? 'others' : 'grill')
    }
  }, [shouldDisplayExternalSourceAsDefault, isOpen])

  const [usedChatId, setUsedChatId] = useState(chatId)
  const { mutateAsync, error, isLoading } = useCreateDiscussion()
  useToastError(error, 'Failed to create discussion')

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
          'fixed right-0 top-0 z-30 flex h-screen w-full max-w-[500px] translate-x-1/3 flex-col bg-[#eceff4] opacity-0 transition dark:bg-[#11172a]',
          isOpen && 'translate-x-0 opacity-100'
        )}
      >
        <Button
          size='circle'
          variant='white'
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
                'rounded-md px-3 py-1.5',
                selectedTab === 'grill' && 'bg-background-primary text-white'
              )}
              onClick={() => setSelectedTab('grill')}
            >
              Grill
            </Button>
            <Button
              size='noPadding'
              variant='transparent'
              className={cx(
                'rounded-md px-3 py-1.5',
                selectedTab === 'others' && 'bg-background-primary text-white'
              )}
              onClick={() => setSelectedTab('others')}
            >
              Other Sources
            </Button>
          </div>
        </div>
        {selectedTab === 'grill' ? (
          <ChatRoom
            chatId={chatId}
            hubId={hubId}
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
      </div>
    </>,
    document.body
  )
}

function ExternalSourceChatRoom({
  comments,
  switchToGrillTab,
}: {
  comments: ProposalComment[]
  switchToGrillTab: () => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <ScrollableContainer
        ref={containerRef}
        className='flex flex-1 flex-col-reverse'
      >
        <Container className='flex flex-1 flex-col-reverse gap-2 pb-2 pt-4'>
          {comments.map((comment) => (
            <ExternalChatItem
              comment={comment}
              key={comment.id}
              containerRef={containerRef}
            />
          ))}
        </Container>
      </ScrollableContainer>
      <div className='p-2'>
        <Button size='lg' className='w-full' onClick={switchToGrillTab}>
          Switch to Grill comments
        </Button>
      </div>
    </div>
  )
}
