import Button from '@/components/Button'
import CaptchaTermsAndService from '@/components/captcha/CaptchaTermsAndService'
import ChatRoom from '@/components/chats/ChatRoom'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import {
  getChatPageLink,
  getCurrentUrlWithoutQuery,
  getHubPageLink,
  getUrlQuery,
} from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import dynamic from 'next/dynamic'
import Image, { ImageProps } from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import urlJoin from 'url-join'

const AboutChatModal = dynamic(
  () => import('@/components/modals/about/AboutChatModal'),
  {
    ssr: false,
  }
)

type ChatMetadata = { title: string; body: string; image: string }

export type ChatPageProps = {
  hubId: string
  chatId?: string
  stubMetadata?: ChatMetadata
}
export default function ChatPage({
  hubId,
  chatId = '',
  stubMetadata,
}: ChatPageProps) {
  const router = useRouter()

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

  const content = chat?.content ?? stubMetadata

  return (
    <DefaultLayout
      withFixedHeight
      navbarProps={{
        backButtonProps: {
          defaultBackLink: getHubPageLink(router),
          forceUseDefaultBackLink: false,
        },
        customContent: ({ backButton, authComponent, colorModeToggler }) => (
          <div className='flex w-full items-center justify-between gap-4 overflow-hidden'>
            <NavbarChatInfo
              backButton={backButton}
              image={content?.image ? getIpfsContentUrl(content.image) : ''}
              messageCount={messageIds?.length ?? 0}
              chatMetadata={content}
              chatId={chatId}
            />
            <div className='flex items-center gap-4'>
              {colorModeToggler}
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
        className='flex-1 overflow-hidden'
      />
      <BottomPanel />
    </DefaultLayout>
  )
}

function BottomPanel() {
  const shouldSendMessageWithoutCaptcha = useMyAccount((state) => {
    const isEnergyLoading = state.address && state.energy === null
    if (!state.isInitialized || isEnergyLoading) return true

    const isLoggedIn = !!state.address
    const hasEnoughEnergy = (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
    return isLoggedIn && hasEnoughEnergy
  })

  return (
    <Container as='div' className='pb-2 text-center text-sm text-text-muted'>
      {shouldSendMessageWithoutCaptcha ? (
        <p>
          Powered by{' '}
          <LinkText
            variant='primary'
            href='https://subsocial.network/'
            openInNewTab
          >
            Subsocial
          </LinkText>
        </p>
      ) : (
        <CaptchaTermsAndService />
      )}
    </Container>
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
  backButton: JSX.Element
  chatMetadata?: ChatMetadata
  chatId?: string
}) {
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

    const baseUrl = getChatPageLink(routerRef.current)
    if (isOpenAboutChatModal) {
      replaceUrl(urlJoin(baseUrl, '/about'))
    } else if (!isOpenAboutChatModal && prevIsOpenAboutChatModal) {
      replaceUrl(baseUrl)
    }
  }, [isOpenAboutChatModal, prevIsOpenAboutChatModal, routerRef])

  useEffect(() => {
    const open = getUrlQuery('open')
    if (open !== 'about') return

    setIsOpenAboutChatModal(true)
    router.push(getCurrentUrlWithoutQuery(), undefined, { shallow: true })
  }, [router])

  const chatTitle = chatMetadata?.title

  return (
    <div className='flex flex-1 items-center overflow-hidden'>
      {enableBackButton && backButton}
      <Button
        variant='transparent'
        interactive='none'
        size='noPadding'
        className={cx(
          'flex flex-1 items-center gap-2 overflow-hidden rounded-none text-left',
          !chatId && 'cursor-pointer'
        )}
        onClick={() => setIsOpenAboutChatModal(true)}
      >
        <div
          className={cx(
            getCommonClassNames('chatImageBackground'),
            'h-9 w-9 flex-shrink-0 justify-self-end'
          )}
        >
          {image && (
            <Image
              className='h-full w-full object-cover'
              width={36}
              height={36}
              src={image}
              alt={chatTitle ?? 'chat topic'}
            />
          )}
        </div>
        <div className='flex flex-col overflow-hidden'>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
            {chatTitle ?? 'Topic'}
          </span>
          <span className='text-xs text-text-muted'>
            {messageCount} messages
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
