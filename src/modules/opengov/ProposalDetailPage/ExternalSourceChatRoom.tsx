import Button from '@/components/Button'
import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { Proposal, ProposalComment } from '@/old/server/opengov/mapper'
import { useRef } from 'react'
import ExternalChatItem from './ExternalChatItem'

export default function ExternalSourceChatRoom({
  comments,
  proposal,
  switchToGrillTab,
}: {
  proposal: Proposal
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
          {comments.map((comment, idx) => (
            <ExternalChatItem
              proposal={proposal}
              comment={comment}
              key={idx}
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
