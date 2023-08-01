import Button from '@/components/Button'
import CaptchaTermsAndService from '@/components/captcha/CaptchaTermsAndService'
import ChatHiddenChip from '@/components/chats/ChatHiddenChip'
import ChatImage from '@/components/chats/ChatImage'
import ChatRoom from '@/components/chats/ChatRoom'
import ChatCreateSuccessModal from '@/components/community/ChatCreateSuccessModal'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import { getPluralText } from '@/components/PluralText'
import Spinner from '@/components/Spinner'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useExtensionData } from '@/stores/extension'
import { useMyAccount } from '@/stores/my-account'
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
  const [isOpenCreateSuccessModal, setIsOpenCreateSuccessModal] =
    useState(false)

  useEffect(() => {
    const isNewChat = getUrlQuery('new')
    if (isNewChat) {
      setIsOpenCreateSuccessModal(true)
      replaceUrl(getCurrentUrlWithoutQuery())
    }
  }, [])

  const { data: messageIds } = useCommentIdsByPostId(chatId, {
    subscribe: true,
  })

  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )

  useEffect(() => {
    const query = getUrlQuery('donateTo')
    if (!query) return

    replaceUrl(getCurrentUrlWithoutQuery('donateTo'))
    try {
      const donateTo = JSON.parse(query)
      if (donateTo.messageId && donateTo.recipient)
        openExtensionModal('subsocial-donations', donateTo)
    } catch {}
  }, [openExtensionModal])

  const myAddress = useMyAccount((state) => state.address)
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

  return (
    <>
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

      <ChatCreateSuccessModal
        chatId={chatId}
        hubId={hubId}
        isOpen={isOpenCreateSuccessModal}
        closeModal={() => setIsOpenCreateSuccessModal(false)}
      />
    </>
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
  const { data: chat } = getPostQuery.useQuery(chatId ?? '', {
    showHiddenPost: { type: 'all' },
  })

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
    if (open !== 'about' || !router.isReady) return

    setIsOpenAboutChatModal(true)
    replaceUrl(getCurrentUrlWithoutQuery())
  }, [router])

  const chatTitle = chatMetadata?.title
  const membersCount = chat?.struct.followersCount

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
        <ChatImage
          chatId={chatId}
          className='h-9 w-9'
          image={image}
          chatTitle={chatTitle}
        />
        <div className='flex flex-col overflow-hidden'>
          <div className='flex items-center gap-2 overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {chatTitle ?? 'Topic'}
            </span>
            {chat?.struct.hidden && (
              <ChatHiddenChip popOverProps={{ placement: 'bottom' }} />
            )}
          </div>
          <span className='text-xs text-text-muted'>
            {membersCount
              ? `${membersCount} ${getPluralText({
                  count: membersCount,
                  plural: 'members',
                  singular: 'member',
                })}`
              : `${messageCount} ${getPluralText({
                  count: messageCount,
                  plural: 'messages',
                  singular: 'message',
                })}`}
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
