import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import { cx } from '@/utils/class-names'
import { createPortal } from 'react-dom'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'

type Props = {
  hubId: string
  chatId: string
  className?: string
}

export default function ChatContent({ chatId, hubId, className }: Props) {
  return (
    <div
      className={cx(
        'sticky top-14 flex flex-col border-x border-border-gray bg-background-light max-lg:h-[calc(100dvh-8.2rem)] lg:h-[calc(100dvh-4rem)]',
        className
      )}
    >
      <div className='w-full'>
        <ChatRoom
          asContainer
          chatId={chatId}
          hubId={hubId}
          className='overflow-auto max-lg:h-[calc(100dvh-8.2rem)] lg:h-[calc(100dvh-4rem)]'
        />
      </div>
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
