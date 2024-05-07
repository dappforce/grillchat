import Button from '@/components/Button'
import Tabs from '@/components/Tabs'
import { cx } from '@/utils/class-names'
import { createPortal } from 'react-dom'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'

type Props = {
  hubId: string
  close: () => void
  isOpen: boolean
}

const tabs = [
  {
    id: 'trending-memes',
    text: 'Trending Memes',
    content: () => <></>,
  },
  {
    id: 'recent-memes',
    text: 'Recent Memes',
    content: () => <></>,
  },
]

export default function ChatContent(props: { hubId: string }) {
  return (
    <div className='flex flex-col border-x border-border-gray bg-background-light'>
      <Tabs
        className='p-0 first:[&>span]:rounded-s-none last:[&>span]:rounded-e-none'
        panelClassName='mt-0 w-full max-w-full'
        tabClassName={(selected) =>
          cx(
            {
              ['border-none bg-[#EFF4FF] [&>span]:!text-text-primary']:
                selected,
            },
            'border-t-0 border-r-0 border-l-0 [&>span]:text-slate-500 leading-6 font-medium py-[10px]'
          )
        }
        asContainer
        tabStyle='buttons'
        defaultTab={0}
        tabs={tabs}
      />
    </div>
  )
}

export function MobileChatContent({ hubId, close, isOpen }: Props) {
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
          'pointer-events-none fixed right-0 top-0 z-30 flex h-screen w-full max-w-[500px] translate-x-1/3 flex-col bg-[#eceff4] opacity-0 transition dark:bg-[#11172a]',
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
        <ChatContent hubId={hubId} />
      </div>
    </>,
    document.body
  )
}
