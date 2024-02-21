import Button from '@/components/Button'
import Container from '@/components/Container'
import LinkText from '@/components/LinkText'
import { Skeleton } from '@/components/SkeletonFallback'
import ExtensionModals from '@/components/extensions'
import TextArea from '@/components/inputs/TextArea'
import { getIsHubWithoutJoinButton } from '@/constants/config'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import useLoginOption from '@/hooks/useLoginOption'
import { getHasUserStakedQuery, getPostQuery } from '@/services/api/query'
import { JoinChatWrapper } from '@/services/subsocial/posts/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMessageData } from '@/stores/message'
import { useMyAccount } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import { ComponentProps, ReactNode, RefObject, useEffect, useRef } from 'react'
import ChatInputBar from './ChatInputBar'

const ChatList = dynamic(() => import('../ChatList/ChatList'), {
  ssr: false,
})
const ActionDetailBar = dynamic(() => import('./ActionDetailBar'), {
  ssr: false,
})

export type ChatRoomProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  customAction?: ReactNode
  chatId: string
  hubId: string
}

export default function ChatRoom({
  className,
  asContainer,
  scrollableContainerClassName,
  customAction,
  chatId,
  hubId,
  ...props
}: ChatRoomProps) {
  const replyTo = useMessageData((state) => state.replyTo)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        hubId={hubId}
        newMessageNoticeClassName={cx(replyTo && 'bottom-2')}
        chatId={chatId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
      />
      <ChatInputWrapper
        customAction={customAction}
        chatId={chatId}
        hubId={hubId}
        asContainer={asContainer}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  )
}

type ChatInputWrapperProps = Pick<
  ChatRoomProps,
  'asContainer' | 'chatId' | 'hubId' | 'customAction'
> & {
  scrollContainerRef: RefObject<HTMLDivElement>
}
function ChatInputWrapper({
  asContainer,
  chatId,
  hubId,
  customAction,
  scrollContainerRef,
}: ChatInputWrapperProps) {
  const clearAction = useMessageData((state) => state.clearAction)
  const sendEvent = useSendEvent()

  const openProfileModal = useProfileModal((state) => state.openModal)
  const openLoginModal = useLoginModal((state) => state.setIsOpen)
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const { loginOption } = useLoginOption()

  const { data: hasUserStaked, isLoading: isLoadingStakedInfo } =
    getHasUserStakedQuery.useQuery({
      address: parentProxyAddress ?? '',
    })

  useEffect(() => {
    return () => clearAction()
  }, [clearAction])

  const Component = asContainer ? Container<'div'> : 'div'

  const scrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer?.scrollTo({
        top: scrollContainer?.scrollHeight,
        behavior: 'auto',
      })
    }
  }

  const { isJoined, isLoading: isLoadingJoinedChat } = useIsJoinedToChat(chatId)
  const isHubWithoutJoinButton = getIsHubWithoutJoinButton(hubId, chatId)

  const { data: chat } = getPostQuery.useQuery(chatId, {
    showHiddenPost: { type: 'all' },
  })
  const isHidden = chat?.struct.hidden

  return (
    <>
      <Component className={cx('mt-auto flex flex-col py-2 pt-0')}>
        <ActionDetailBar
          chatId={chatId}
          hubId={hubId}
          scrollContainer={scrollContainerRef}
        />
        {(() => {
          if (customAction) return customAction

          if (loginOption === 'polkadot') {
            if (!parentProxyAddress) {
              return (
                <Button
                  variant='primary'
                  size='lg'
                  onClick={() => {
                    if (isLoggedIn)
                      openProfileModal({ defaultOpenState: 'polkadot-connect' })
                    else openLoginModal(true, 'polkadot-connect')
                  }}
                >
                  Connect Polkadot wallet
                </Button>
              )
            } else if (isLoadingStakedInfo) {
              return <Skeleton className='h-12 w-full' />
            } else if (!hasUserStaked) {
              return (
                <span className='flex h-12 items-center justify-center rounded-full bg-background-light/50 px-8 text-center text-sm text-text-muted'>
                  <span>
                    In order to participate in this chat, you must{' '}
                    <LinkText
                      className='font-semibold'
                      variant='primary'
                      href='https://sub.id/creators'
                    >
                      stake SUB
                    </LinkText>
                    , enable Grill.chat notifications, and sign in to Grill with
                    that account, or link it to your existing account.
                  </span>
                </span>
              )
            }
          }

          if (isHidden)
            return (
              <TextArea
                rows={1}
                disabled
                value='You cannot send messages in a hidden chat'
                className='bg-background-light/50 text-center text-text-muted !brightness-100'
                variant='fill'
                pill
              />
            )

          if (isJoined || isHubWithoutJoinButton)
            return (
              <ChatInputBar
                formProps={{
                  hubId,
                  chatId,
                  onSubmit: (isEditing) => {
                    if (!isEditing) scrollToBottom()
                  },
                  isPrimary: true,
                }}
              />
            )

          return (
            <JoinChatWrapper>
              {({ isLoading, mutateAsync }) => {
                const isButtonLoading = isLoading || isLoadingJoinedChat
                return (
                  <Button
                    size='lg'
                    className={cx(
                      isButtonLoading && 'bg-background-light text-text-muted'
                    )}
                    disabledStyle='subtle'
                    isLoading={isButtonLoading}
                    onClick={async () => {
                      await mutateAsync({ chatId })
                      sendEvent(
                        'join_chat',
                        { chatId, hubId, eventSource: 'chat_required_btn' },
                        { hasJoinedChats: true }
                      )
                    }}
                  >
                    Join
                  </Button>
                )
              }}
            </JoinChatWrapper>
          )
        })()}
      </Component>

      <ExtensionModals
        hubId={hubId}
        chatId={chatId}
        onSubmit={scrollToBottom}
      />
    </>
  )
}
