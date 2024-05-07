import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'

type Props = {
  hubId: string
  chatId: string
}

export default function ChatContent(props: Props) {
  const [selectedTab, setSelectedTab] = useState<'trending' | 'recent'>(
    'trending'
  )
  return (
    <div className='flex h-full flex-col border-x border-border-gray bg-background-light'>
      <div className='flex items-center justify-between gap-4 border-b border-border-gray px-2 py-2'>
        <span className='font-semibold'>Meme2earn</span>
        <div className='flex whitespace-nowrap rounded-md bg-[#eceff4] text-sm font-medium text-text-muted dark:bg-[#11172a]'>
          <Button
            size='noPadding'
            variant='transparent'
            className={cx(
              'rounded-md rounded-r-none px-3 py-1.5',
              selectedTab === 'trending' && 'bg-background-primary text-white'
            )}
            onClick={() => setSelectedTab('trending')}
          >
            Trending
          </Button>
          <Button
            size='noPadding'
            variant='transparent'
            className={cx(
              'rounded-md rounded-l-none px-3 py-1.5',
              selectedTab === 'recent' && 'bg-background-primary text-white'
            )}
            onClick={() => setSelectedTab('recent')}
          >
            Recent
          </Button>
        </div>
      </div>
      <ChatRoom asContainer chatId={props.chatId} hubId={props.hubId} />
    </div>
  )
}

export function MobileChatContent({
  hubId,
  close,
  isOpen,
  chatId,
}: Props & {
  close: () => void
  isOpen: boolean
}) {
  return createPortal(
    <>
      <div
        className={cx(
          'pointer-events-none fixed inset-0 z-[25] bg-black/70 opacity-0 transition',
          isOpen && 'pointer-events-auto opacity-100'
        )}
        onClick={close}
      />
      <div
        className={cx(
          'pointer-events-none fixed right-0 top-0 z-30 flex h-screen w-[500px] max-w-[85vw] translate-x-1/3 flex-col bg-[#eceff4] opacity-0 transition dark:bg-[#11172a]',
          isOpen && 'pointer-events-auto translate-x-0 opacity-100'
        )}
      >
        <Button
          size='circle'
          variant='bgLighter'
          className='absolute -left-2 top-2 -translate-x-full rounded-md'
          onClick={close}
        >
          <MdKeyboardDoubleArrowRight />
        </Button>
        <ChatContent hubId={hubId} chatId={chatId} />
      </div>
    </>,
    document.body
  )
}
