import Thumbsup from '@/assets/emojis/thumbsup.png'
import AddressAvatar from '@/components/AddressAvatar'
import { SuperLikeWrapper } from '@/components/content-staking/SuperLike'
import { FloatingWrapperProps } from '@/components/floating/FloatingWrapper'
import useLongTouch from '@/hooks/useLongTouch'
import { PostRewards } from '@/services/datahub/content-staking/query'
import { useProfilePostsModal } from '@/stores/profile-posts-modal'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { PostData } from '@subsocial/api/types'
import { useHapticFeedbackRaw } from '@tma.js/sdk-react'
import { ComponentProps, useRef } from 'react'
import { ScrollToMessage } from '../ChatList/hooks/useScrollToMessage'
import ChatItemMenus from './ChatItemMenus'
import ChatItemWithExtension from './ChatItemWithExtension'
import Embed, { useCanRenderEmbed } from './Embed'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem, {
  shouldRenderEmojiChatItem,
} from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  message: PostData
  isMyMessage: boolean
  messageBubbleId?: string
  scrollToMessage?: ScrollToMessage
  enableChatMenu?: boolean
  enableProfileModal?: boolean
  chatId: string
  hubId: string
  bg?: 'background-light' | 'background'
  showApproveButton?: boolean
  disableSuperLike?: boolean
  menuIdPrefix?: string
}

export default function ChatItem({
  message,
  isMyMessage,
  scrollToMessage,
  messageBubbleId,
  enableChatMenu = true,
  chatId,
  hubId,
  disableSuperLike,
  bg = 'background-light',
  showApproveButton,
  enableProfileModal = true,
  menuIdPrefix,
  ...props
}: ChatItemProps) {
  const { ownerId, id: messageId } = message.struct
  const { body, extensions, link } = message.content || {}
  const { openModal } = useProfilePostsModal()

  const canRenderEmbed = useCanRenderEmbed(link ?? '')

  if (showApproveButton && message.struct.approvedInRootPost) return null

  if (!body && (!extensions || extensions.length === 0)) return null

  const isEmojiOnly = shouldRenderEmojiChatItem(body ?? '')
  const ChatItemContentVariant = isEmojiOnly ? EmojiChatItem : DefaultChatItem

  return (
    <>
      <div
        {...props}
        className={cx(
          'relative flex items-start justify-start gap-2',
          isMyMessage && 'flex-row-reverse',
          props.className
        )}
      >
        {!isMyMessage && (
          <AddressAvatar
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              if (enableProfileModal) {
                openModal({ chatId, hubId, messageId, address: ownerId })
              }
            }}
            address={ownerId}
            className='flex-shrink-0 cursor-pointer'
          />
        )}
        <ChatItemMenus
          menuIdPrefix={menuIdPrefix}
          chatId={chatId}
          messageId={message.id}
          enableChatMenu={enableChatMenu}
          hubId={hubId}
        >
          {(config) => (
            <SuperLikeWrapper postId={messageId} withPostReward={false}>
              {(props) => {
                return (
                  <ChatItemMenuWrapper
                    config={config}
                    superLikeProps={props}
                    messageBubbleId={messageBubbleId}
                  >
                    {extensions && extensions.length > 0 ? (
                      <ChatItemWithExtension
                        scrollToMessage={scrollToMessage}
                        message={message}
                        isMyMessage={isMyMessage}
                        chatId={chatId}
                        hubId={hubId}
                        enableProfileModal={enableProfileModal}
                        bg={bg}
                        showApproveButton={showApproveButton}
                      />
                    ) : (
                      <ChatItemContentVariant
                        message={message}
                        isMyMessage={isMyMessage}
                        scrollToMessage={scrollToMessage}
                        chatId={chatId}
                        enableProfileModal={enableProfileModal}
                        hubId={hubId}
                        bg={bg}
                      />
                    )}
                  </ChatItemMenuWrapper>
                )
              }}
            </SuperLikeWrapper>
          )}
        </ChatItemMenus>
      </div>
      {canRenderEmbed && (
        <div className={cx(isMyMessage ? 'flex justify-end' : 'flex')}>
          {/* Offset for avatar */}
          {!isMyMessage && <div className='w-11 flex-shrink-0' />}
          <Embed
            className={cx('mt-1', isMyMessage ? 'flex justify-end' : 'flex')}
            link={link ?? ''}
          />
        </div>
      )}
    </>
  )
}

type ChatItemMenuWrapperProps = {
  config?: Parameters<FloatingWrapperProps['children']>[0]
  superLikeProps: {
    hasILiked: boolean
    isDisabled: boolean
    disabledCause: string
    superLikeCount: number
    handleClick: () => void
    postRewards?: PostRewards | undefined | null
  }
  children: React.ReactNode
  messageBubbleId?: string
}

const animateHeart = (x: number, y: number) => {
  const container = document.getElementById('__next')
  if (container) {
    const like = document.createElement('img')

    like.src = Thumbsup.src
    like.classList.add('big-floating-like')

    like.style.left = `${x - 50}px`
    like.style.top = `${y - 50}px`

    container.appendChild(like)

    like.addEventListener(
      'animationend',
      () => {
        like.remove()
      },
      { once: true }
    )
  }
}

const ChatItemMenuWrapper = ({
  config,
  superLikeProps,
  children,
  messageBubbleId,
}: ChatItemMenuWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { toggleDisplay, referenceProps } = config || {}
  const haptic = useHapticFeedbackRaw(true)

  const { hasILiked, isDisabled, handleClick } = superLikeProps

  const onLongPress = useLongTouch(
    (e) => {
      if (isTouchDevice()) {
        toggleDisplay?.(e)
      }
    },
    { delay: 500 },
    {
      startAnimation: () => {
        if (containerRef.current) {
          containerRef.current.classList.add('scale-section')

          containerRef.current.addEventListener(
            'animationend',
            () => {
              if (containerRef.current) {
                containerRef.current.classList.remove('scale-section')
              }
            },
            { once: true }
          )
        }
      },
      endAnimation: () => {
        if (containerRef.current) {
          containerRef.current.classList.remove('scale-section')
        }
      },
    }
  )

  return (
    <div
      ref={containerRef}
      className={cx('relative flex flex-col')}
      onContextMenu={(e) => {
        if (!isTouchDevice()) {
          e.preventDefault()
          toggleDisplay?.(e)
        }
      }}
      {...onLongPress}
      onDoubleClick={(e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isDisabled && !hasILiked) {
          haptic?.result?.impactOccurred('medium')
          handleClick()
          animateHeart(e.clientX, e.clientY)
        }
      }}
      {...referenceProps}
      id={messageBubbleId}
    >
      {children}
    </div>
  )
}
