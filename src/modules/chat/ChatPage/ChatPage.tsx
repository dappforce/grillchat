import Button from '@/components/Button'
import ChatHiddenChip from '@/components/chats/ChatHiddenChip'
import ChatImage from '@/components/chats/ChatImage'
import ChatModerateChip from '@/components/chats/ChatModerateChip'
import ChatRoom from '@/components/chats/ChatRoom'
import ChatCreateSuccessModal from '@/components/community/ChatCreateSuccessModal'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import { getPluralText } from '@/components/PluralText'
import Spinner from '@/components/Spinner'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import usePrevious from '@/hooks/usePrevious'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { useModerationActions } from '@/services/datahub/moderation/mutation'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import { useExtensionData } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getDatahubConfig } from '@/utils/env/client'
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

const NetworkStatus = dynamic(() => import('@/components/NetworkStatus'), {
  ssr: false,
})
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
    enabled: !!getDatahubConfig(),
  })
  const { data: commentIds } = getCommentIdsByPostIdFromChainQuery.useQuery(
    chatId,
    {
      enabled: !getDatahubConfig(),
    }
  )

  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )

  useEffect(() => {
    const query = getUrlQuery('donateTo')
    if (!query) return

    replaceUrl(getCurrentUrlWithoutQuery('donateTo'))
    try {
      const donateTo = (JSON.parse(query) || {}) as {
        messageId: string
        recipient: string
      }
      if (donateTo.messageId && donateTo.recipient)
        openExtensionModal('subsocial-donations', donateTo)
    } catch {}
  }, [openExtensionModal])

  const myAddress = useMyMainAddress()
  const isSignerReady = useMyAccount((state) => !!state.signer)
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

  const { isAuthorized, isOwner, isLoading, moderatorData } =
    useAuthorizedForModeration(chatId)
  const { mutateAsync: commitModerationAction } = useModerationActions()

  const chatEntityId = chat?.entityId
  useEffect(() => {
    if (!isOwner) return
    if (!isAuthorized && !isLoading && chatEntityId && isSignerReady) {
      if (!moderatorData?.exist) {
        commitModerationAction({
          callName: 'synth_moderation_init_moderator',
          args: {
            ctxPostIds: [chatEntityId],
            withOrganization: true,
          },
        })
      } else {
        commitModerationAction({
          callName: 'synth_moderation_add_ctx_to_organization',
          args: {
            ctxPostIds: [chatEntityId],
            organizationId: moderatorData?.organizationId ?? '',
          },
        })
      }
    }
  }, [
    moderatorData,
    isSignerReady,
    isAuthorized,
    commitModerationAction,
    isLoading,
    chatEntityId,
    isOwner,
  ])

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
  const messageCount =
    chatMetadata?.totalCommentsCount ?? commentIds?.length ?? 0

  return (
    <>
      <DefaultLayout
        withFixedHeight
        navbarProps={{
          backButtonProps: {
            defaultBackLink: getHubPageLink(router),
            forceUseDefaultBackLink: false,
          },
          customContent: ({ backButton, authComponent, notificationBell }) => (
            <div className='flex w-full items-center justify-between gap-4 overflow-hidden'>
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
          className='flex-1 overflow-hidden'
          customAction={customAction}
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
  return (
    <Container as='div' className='pb-2 text-center text-sm text-text-muted'>
      <p className='inline'>
        Powered by{' '}
        <LinkText
          variant='primary'
          href='https://subsocial.network/'
          openInNewTab
        >
          Subsocial
        </LinkText>
      </p>
      <NetworkStatus className='ml-2 inline-block' />
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
  backButton: ReactNode
  chatMetadata?: ChatMetadata
  chatId: string
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
        <ChatImage
          chatId={chatId}
          className='h-9 w-9'
          image={image}
          chatTitle={chatTitle}
        />
        <div className='flex flex-col overflow-hidden'>
          <div className='flex items-center gap-2 overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {chatTitle || 'Untitled'}
            </span>
            <ChatModerateChip chatId={chatId} />
            {chat?.struct.hidden && (
              <ChatHiddenChip popOverProps={{ placement: 'bottom' }} />
            )}
          </div>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-text-muted'>
            {`${messageCount} ${getPluralText({
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
