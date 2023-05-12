import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useConfigContext } from '@/contexts/ConfigContext'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import {
  getChatPageLink,
  getCurrentUrlWithoutQuery,
  getUrlQuery,
} from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { PostData } from '@subsocial/api/types'
import dynamic from 'next/dynamic'
import Image, { ImageProps } from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import urlJoin from 'url-join'
import ChatPageNavbarExtension from './ChatPageNavbarExtension'

const AboutChatModal = dynamic(
  () => import('@/components/modals/AboutChatModal'),
  {
    ssr: false,
  }
)

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
      withFixedHeight
      navbarProps={{
        customContent: ({ backButton, authComponent, colorModeToggler }) => (
          <div className='flex items-center justify-between gap-4'>
            <NavbarChatInfo
              backButton={backButton}
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
  backButton,
}: {
  image: ImageProps['src']
  messageCount: number
  chat?: PostData | null
  backButton: JSX.Element
}) {
  const [isOpenAboutChatModal, setIsOpenAboutChatModal] = useState(false)
  const router = useRouter()
  const { isChatRoomOnly } = useConfigContext()

  const routerRef = useWrapInRef(router)
  const isInitialized = useRef(false)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }

    const baseUrl = getChatPageLink(routerRef.current)
    if (isOpenAboutChatModal) {
      replaceUrl(urlJoin(baseUrl, '/about'))
    } else {
      replaceUrl(baseUrl)
    }
  }, [isOpenAboutChatModal, routerRef])

  useEffect(() => {
    const open = getUrlQuery('open')
    if (open !== 'about') return

    setIsOpenAboutChatModal(true)
    router.push(getCurrentUrlWithoutQuery(), undefined, { shallow: true })
  }, [router])

  const chatTitle = chat?.content?.title

  return (
    <div className='flex flex-1 items-center'>
      {!isChatRoomOnly && backButton}
      <Button
        variant='transparent'
        interactive='none'
        size='noPadding'
        className='flex flex-1 items-center gap-2 overflow-hidden rounded-none text-left'
        onClick={() => setIsOpenAboutChatModal(true)}
      >
        <Image
          className={cx(
            getCommonClassNames('chatImageBackground'),
            'h-9 w-9 justify-self-end'
          )}
          width={36}
          height={36}
          src={image}
          alt={chatTitle ?? 'chat topic'}
        />
        <div className='flex flex-col overflow-hidden'>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
            {chatTitle ?? 'Topic'}
          </span>
          <span className='text-xs text-text-muted'>
            {messageCount} messages
          </span>
        </div>
      </Button>

      <AboutChatModal
        isOpen={isOpenAboutChatModal}
        closeModal={() => setIsOpenAboutChatModal(false)}
        chatId={chat?.id}
        messageCount={messageCount}
      />
    </div>
  )
}
