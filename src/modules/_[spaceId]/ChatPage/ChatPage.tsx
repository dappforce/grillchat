import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useIsInIframe from '@/hooks/useIsInIframe'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getHomePageLink } from '@/utils/links'
import { PostData } from '@subsocial/api/types'
import Image, { ImageProps } from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import ChatPageNavbarExtension from './ChatPageNavbarExtension'

export type ChatPageProps = { chatId: string }
export default function ChatPage({ chatId }: ChatPageProps) {
  const { data: chat } = getPostQuery.useQuery(chatId)
  const { data: messageIds } = useCommentIdsByPostId(chatId, {
    subscribe: true,
  })

  const { setLastReadMessageId } = useLastReadMessageId(chatId)

  useEffect(() => {
    const lastId = messageIds?.[messageIds.length - 1]
    if (!lastId) return
    setLastReadMessageId(lastId)
  }, [setLastReadMessageId, messageIds])

  const content = chat?.content

  return (
    <DefaultLayout
      navbarProps={{
        customContent: (_, authComponent, colorModeToggler) => (
          <div className='flex items-center justify-between gap-4'>
            <NavbarChatInfo
              image={content?.image ? getIpfsContentUrl(content.image) : ''}
              messageCount={messageIds?.length ?? 0}
              chat={chat}
            />
            <div className='flex items-center gap-4'>
              {colorModeToggler}
              {authComponent}
            </div>
          </div>
        ),
      }}
    >
      <ChatPageNavbarExtension />
      <ChatRoom
        chatId={chatId}
        asContainer
        className='flex-1 overflow-hidden'
      />
    </DefaultLayout>
  )
}

function NavbarChatInfo({
  image,
  messageCount,
  chat,
}: {
  image: ImageProps['src']
  messageCount: number
  chat?: PostData | null
}) {
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const topic = chat?.content?.title

  return (
    <div className='flex items-center'>
      <div className='mr-2 flex w-9 items-center justify-center'>
        <Button
          size='circle'
          href={getHomePageLink(router)}
          nextLinkProps={{ replace: isInIframe }}
          variant='transparent'
        >
          <HiOutlineChevronLeft />
        </Button>
      </div>
      <div className='flex items-center gap-2 overflow-hidden'>
        <Image
          className='h-9 w-9 justify-self-end rounded-full bg-background-light bg-gradient-to-b from-[#E0E7FF] to-[#A5B4FC] object-cover'
          width={36}
          height={36}
          src={image}
          alt={topic ?? 'chat topic'}
        />
        <div className='flex flex-col overflow-hidden'>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
            {topic ?? 'Topic'}
          </span>
          <span className='text-xs text-text-muted'>
            {messageCount} messages
          </span>
        </div>
      </div>
    </div>
  )
}
