import Button from '@/components/Button'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import useIsMounted from '@/hooks/useIsMounted'
import { useState } from 'react'
import ChatContent, { MobileChatContent } from './ChatContent'
import MainContent from './MainContent'

export type HomePageProps = {}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DefaultLayout withSidebar>
      <Container className='grid flex-1 grid-cols-1 gap-4 px-4 lg:grid-cols-[1fr_325px] xl:grid-cols-[1fr_400px]'>
        <MainContent />
        <ChatContentRenderer isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className='sticky bottom-0 -mx-4 flex self-end border-t border-border-gray bg-background-light p-4 lg:hidden'>
          <Button
            className='flex w-full items-center justify-center gap-2'
            size='lg'
            onClick={() => setIsOpen(true)}
          >
            <span>Post memes & earn</span>
            <span className='text-white/70'>+3</span>
          </Button>
        </div>
      </Container>
    </DefaultLayout>
  )
}

function ChatContentRenderer({
  setIsOpen,
  isOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const lgUp = useBreakpointThreshold('lg')
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <>
      {lgUp ? (
        <div className='h-[calc(100dvh_-_3.5rem)]'>
          <ChatContent
            hubId='0xc75507f88e6a7d555c15ac95c49cb426'
            chatId='0x3b1bf91da3fd7e5d790c19039110a5a7'
          />
        </div>
      ) : (
        <MobileChatContent
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          hubId='0xc75507f88e6a7d555c15ac95c49cb426'
          chatId='0x3b1bf91da3fd7e5d790c19039110a5a7'
        />
      )}
    </>
  )
}
