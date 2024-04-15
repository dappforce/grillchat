import Button from '@/components/Button'
import Card from '@/components/Card'
import MdRenderer from '@/components/MdRenderer'
import ChatItem from '@/components/chats/ChatItem'
import ChatRoom from '@/components/chats/ChatRoom'
import usePaginatedMessageIds from '@/components/chats/hooks/usePaginatedMessageIds'
import { env } from '@/env.mjs'
import useToastError from '@/hooks/useToastError'
import { Proposal } from '@/server/opengov/mapper'
import { useCreateDiscussion } from '@/services/api/mutation'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { Drawer } from 'vaul'
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

  const myAddress = useMyMainAddress()
  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId ?? '')
  const { allIds } = usePaginatedMessageIds({
    chatId: chatId ?? '',
    hubId: env.NEXT_PUBLIC_PROPOSALS_HUB,
  })
  const lastThreeMessageIds = allIds.slice(0, 3)
  const lastThreeMessages = getPostQuery.useQueries(lastThreeMessageIds)

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
          <Card className='flex flex-col gap-6 bg-background-light'>
            <span className='text-lg font-bold'>Latest Comments</span>
            {!chatId || lastThreeMessages.length === 0 ? (
              <NoMessagesCard onClick={() => setIsOpenDrawer(true)} />
            ) : (
              <div className='flex flex-col gap-2'>
                {lastThreeMessages.map(({ data }) => {
                  if (!data) return
                  return (
                    <ChatItem
                      enableChatMenu={false}
                      key={data.id}
                      message={data}
                      chatId={chatId}
                      hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
                      isMyMessage={data.struct.ownerId === myAddress}
                    />
                  )
                })}
                <Button
                  size='lg'
                  onClick={() => setIsOpenDrawer(true)}
                  className='mt-auto w-full'
                >
                  Show all{' '}
                  {postMetadata?.totalCommentsCount
                    ? `${postMetadata?.totalCommentsCount} `
                    : ''}
                  Comments
                </Button>
              </div>
            )}
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
        onClose={() => setIsOpenDrawer(false)}
      />
    </Drawer.Root>
  )
}

function NoMessagesCard({ onClick }: { onClick: () => void }) {
  return (
    <div className='flex h-32 flex-col items-center justify-center'>
      <div className='rounded-xl bg-background px-4 py-2 text-sm'>
        <span>No messages yet</span>
      </div>
      <Button size='lg' onClick={onClick} className='mt-auto w-full'>
        Comment
      </Button>
    </div>
  )
}

function SidePanel({
  chatId,
  hubId,
  proposal,
  onClose,
}: {
  chatId: string
  hubId: string
  proposal: Proposal
  onClose?: () => void
}) {
  const [selectedTab, setSelectedTab] = useState<'grill' | 'others'>('grill')
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

  return (
    <Drawer.Portal>
      <Drawer.Content className='fixed right-0 top-0 z-20 flex h-screen w-full max-w-[500px] flex-col bg-[#eceff4] dark:bg-[#11172a]'>
        <Button
          size='circle'
          variant='white'
          className='absolute -left-2 top-2 -translate-x-full rounded-md'
          onClick={onClose}
        >
          <MdKeyboardDoubleArrowRight />
        </Button>
        <div className='flex items-center justify-between gap-4 bg-background px-2 py-2'>
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
      </Drawer.Content>
      <Drawer.Overlay className='fixed inset-0 z-10 bg-black/70' />
    </Drawer.Portal>
  )
}
