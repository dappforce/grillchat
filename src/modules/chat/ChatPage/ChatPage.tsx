import Button from '@/components/Button'
import { getPluralText } from '@/components/PluralText'
import Spinner from '@/components/Spinner'
import ChatHiddenChip from '@/components/chats/ChatHiddenChip'
import ChatImage from '@/components/chats/ChatImage'
import ChatModerateChip from '@/components/chats/ChatModerateChip'
import ChatRoom from '@/components/chats/ChatRoom'
import ChatCreateSuccessModal from '@/components/community/ChatCreateSuccessModal'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { useMessageData } from '@/stores/message'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import {
  getChatPageLink,
  getCurrentUrlWithoutQuery,
  getHubPageLink,
  getUrlQuery,
} from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import dynamic from 'next/dynamic'
import { ImageProps } from 'next/image'
import Router, { useRouter } from 'next/router'
import { ReactNode, useEffect, useRef, useState } from 'react'
import urlJoin from 'url-join'
import { communityHubId } from '../HomePage'

const AboutChatModal = dynamic(
  () => import('@/components/modals/about/AboutChatModal'),
  {
    ssr: false,
  }
)

type ChatMetadata = {
  title: string
  body: string
  image: string
  summary?: string
}

export type ChatPageProps = {
  hubId: string
  chatId?: string
  stubMetadata?: ChatMetadata
  customAction?: ReactNode
}
export default function ChatPage({
  hubId,
  chatId = '',
  customAction,
  stubMetadata,
}: ChatPageProps) {
  const resetMessageData = useMessageData((state) => state.reset)
  useEffect(() => {
    return () => resetMessageData()
  }, [resetMessageData])

  const router = useRouter()
  const [isOpenCreateSuccessModal, setIsOpenCreateSuccessModal] =
    useState(false)

  useEffect(() => {
    const isNewChat = getUrlQuery('new')
    if (isNewChat) setIsOpenCreateSuccessModal(true)
  }, [])

  useEffect(() => {
    if (!getUrlQuery('new')) return
    if (!isOpenCreateSuccessModal) replaceUrl(getCurrentUrlWithoutQuery('new'))
  }, [isOpenCreateSuccessModal])

  const { data: chatMetadata } = getPostMetadataQuery.useQuery(chatId, {
    enabled: isDatahubAvailable,
  })
  const myAddress = useMyMainAddress()
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const { data: chat } = getPostQuery.useQuery(chatId, {
    showHiddenPost: { type: 'all' },
  })

  useEffect(() => {
    if (!isInitialized || !chat?.struct.hidden) return

    if (myAddress !== chat.struct.ownerId) {
      Router.push('/')
    }
  }, [isInitialized, myAddress, chat])

  if (chat?.struct.hidden) {
    const isNotAuthorized = myAddress !== chat.struct.ownerId
    if (!isInitialized || isNotAuthorized) {
      return (
        <DefaultLayout>
          <div className='flex flex-1 flex-col items-center justify-center'>
            <Spinner className='h-10 w-10' />
            <span className='mt-2 text-text-muted'>Loading...</span>
          </div>
        </DefaultLayout>
      )
    }
  }

  const content = chat?.content ?? stubMetadata
  const messageCount = chatMetadata?.totalCommentsCount ?? 0

  return (
    <>
      <DefaultLayout
        withFixedHeight
        navbarProps={{
          backButtonProps: {
            defaultBackLink:
              hubId !== communityHubId ? '/my-chats' : getHubPageLink(router),
            forceUseDefaultBackLink: false,
          },
          customContent: ({ backButton, authComponent, notificationBell }) => (
            <div className='flex w-full items-center justify-between gap-4'>
              <NavbarChatInfo
                backButton={backButton}
                image={content?.image ? getIpfsContentUrl(content.image) : ''}
                messageCount={messageCount}
                chatMetadata={content}
                chatId={chatId}
              />
              <div className='flex items-center gap-3'>
                {notificationBell}
                {authComponent}
              </div>
            </div>
          ),
        }}
      >
        <ChatRoom
          hubId={hubId}
          chatId={chatId}
          asContainer
          customAction={customAction}
          className='mb-5'
        />
      </DefaultLayout>

      <ChatCreateSuccessModal
        chatId={chatId}
        hubId={hubId}
        isOpen={isOpenCreateSuccessModal}
        closeModal={() => setIsOpenCreateSuccessModal(false)}
      />
    </>
  )
}

function NavbarChatInfo({
  image,
  messageCount,
  backButton,
  chatMetadata,
  chatId,
}: {
  image: ImageProps['src']
  messageCount: number
  backButton: ReactNode
  chatMetadata?: ChatMetadata
  chatId: string
}) {
  const { data: chat } = getPostQuery.useQuery(chatId ?? '', {
    showHiddenPost: { type: 'all' },
  })

  const { data: space } = getSpaceQuery.useQuery(chat?.struct.spaceId ?? '')

  const [isOpenAboutChatModal, setIsOpenAboutChatModal] = useState(false)
  const prevIsOpenAboutChatModal = usePrevious(isOpenAboutChatModal)
  const router = useRouter()
  const { enableBackButton = true } = useConfigContext()

  const routerRef = useWrapInRef(router)
  const isInitialized = useRef(false)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    if (!chatId) return

    const baseUrl = getChatPageLink(routerRef.current)
    if (isOpenAboutChatModal) {
      replaceUrl(urlJoin(baseUrl, '/about'))
    } else if (!isOpenAboutChatModal && prevIsOpenAboutChatModal) {
      replaceUrl(baseUrl)
    }
  }, [isOpenAboutChatModal, prevIsOpenAboutChatModal, routerRef, chatId])

  useEffect(() => {
    const open = getUrlQuery('open')
    if (open !== 'about' || !router.isReady) return

    setIsOpenAboutChatModal(true)
    replaceUrl(getCurrentUrlWithoutQuery())
  }, [router])

  const chatTitle = chatMetadata?.title || chatMetadata?.summary || 'Untitled'

  let subtitle = (
    <>{`${messageCount} ${getPluralText({
      count: messageCount,
      plural: 'messages',
      singular: 'message',
    })}`}</>
  )

  if (space) {
    const { content: spaceContent } = space || {}

    const chats =
      ((spaceContent as any)?.experimental?.chats as { id: string }[]) ||
      undefined

    const isProfileChat = chats?.[0]?.id === chatId

    if (isProfileChat && spaceContent) {
      const title = spaceContent.name

      subtitle = (
        <span className='font-normal leading-normal'>
          <span className='text-text-muted'>by</span>{' '}
          <span className='text-text'>{title}</span>
        </span>
      )
    }
  }

  return (
    <div className='flex flex-1 items-center'>
      {enableBackButton && backButton}
      <Button
        variant='transparent'
        interactive='none'
        size='noPadding'
        className={cx(
          'flex flex-1 items-center gap-2 rounded-none text-left',
          !chatId && 'cursor-pointer'
        )}
        onClick={() => setIsOpenAboutChatModal(true)}
      >
        <ChatImage
          chatId={chatId}
          className='h-9 w-9'
          image={image}
          chatTitle={chatTitle}
        />
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <span className='line-clamp-1 font-medium'>{chatTitle}</span>
            <ChatModerateChip chatId={chatId} />
            {chat?.struct.hidden && (
              <ChatHiddenChip popOverProps={{ placement: 'bottom' }} />
            )}
          </div>
          <span className='line-clamp-1 text-xs text-text-muted'>
            {subtitle}
          </span>
        </div>
      </Button>

      {chatId && (
        <AboutChatModal
          isOpen={isOpenAboutChatModal}
          closeModal={() => setIsOpenAboutChatModal(false)}
          chatId={chatId}
          messageCount={messageCount}
        />
      )}
    </div>
  )
}
