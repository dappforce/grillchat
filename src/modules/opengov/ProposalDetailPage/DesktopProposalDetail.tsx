import Button from '@/components/Button'
import Card from '@/components/Card'
import MdRenderer from '@/components/MdRenderer'
import ChatItem from '@/components/chats/ChatItem'
import usePaginatedMessageIds from '@/components/chats/hooks/usePaginatedMessageIds'
import { env } from '@/env.mjs'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ProposalDetailPageProps } from './ProposalDetailPage'
import ProposalStatusCard from './ProposalStatusCard'
import ProposerSummary from './ProposerSummary'

export default function DesktopProposalDetail({
  chatId,
  proposal,
  className,
}: ProposalDetailPageProps & { className?: string }) {
  const myAddress = useMyMainAddress()
  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId ?? '')
  const { allIds } = usePaginatedMessageIds({
    chatId: chatId ?? '',
    hubId: env.NEXT_PUBLIC_PROPOSALS_HUB,
  })
  const lastThreeMessageIds = allIds.slice(0, 3)
  const lastThreeMessages = getPostQuery.useQueries(lastThreeMessageIds)

  return (
    <div
      className={cx(
        'container-page grid grid-cols-[3fr_2fr] gap-6 pt-4',
        className
      )}
    >
      <div className='flex flex-col gap-4'>
        <ProposerSummary proposal={proposal} />
        <Card className='flex flex-col items-start gap-6 bg-background-light'>
          <div className='flex w-full items-center justify-between gap-4'>
            <h1 className='text-lg font-bold'>
              #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
              {proposal.title}
            </h1>
            <Button className='flex-shrink-0'>
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
          {(!chatId || lastThreeMessages.length === 0) && <NoMessagesCard />}
          {chatId && (
            <div className='flex flex-col gap-2'>
              {lastThreeMessages.map(({ data }) => {
                if (!data) return
                return (
                  <ChatItem
                    key={data.id}
                    message={data}
                    chatId={chatId}
                    hubId={env.NEXT_PUBLIC_PROPOSALS_HUB}
                    isMyMessage={data.struct.ownerId === myAddress}
                  />
                )
              })}
            </div>
          )}
        </Card>
      </div>
      <div className='sticky top-20 self-start'>
        <ProposalStatusCard proposal={proposal} />
      </div>
    </div>
  )
}

function NoMessagesCard() {
  return (
    <div className='flex h-32 flex-col items-center justify-center text-sm'>
      <div className='rounded-xl bg-background px-4 py-2'>
        <span>No messages yet</span>
      </div>
      <Button size='lg' className='mt-auto w-full'>
        Comment
      </Button>
    </div>
  )
}
