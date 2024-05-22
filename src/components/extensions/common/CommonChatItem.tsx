import Farcaster from '@/assets/logo/farcaster.svg'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import ChatRelativeTime from '@/components/chats/ChatItem/ChatRelativeTime'
import MessageStatusIndicator from '@/components/chats/ChatItem/MessageStatusIndicator'
import RepliedMessagePreview from '@/components/chats/ChatItem/RepliedMessagePreview'
import SubTeamLabel from '@/components/chats/ChatItem/SubTeamLabel'
import { getRepliedMessageId } from '@/components/chats/utils'
import SuperLike from '@/components/content-staking/SuperLike'
import FloatingMenus from '@/components/floating/FloatingMenus'
import { getSuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { isMessageSent } from '@/services/subsocial/commentIds/optimistic'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import Linkify from 'linkify-react'
import { FaXTwitter } from 'react-icons/fa6'
import { GrShareOption } from 'react-icons/gr'
import { ExtensionChatItemProps } from '../types'

type DerivativesData = {
  isMyMessage: boolean
  relativeTime: string
  isSent: boolean
}

type MyMessageConfig = {
  children?: 'top' | 'bottom' | 'middle'
  checkMark?: 'adaptive-inside' | 'share'
}
type OthersMessageConfig = {
  children?: 'bottom' | 'middle'
  checkMark?: 'top' | 'bottom'
}

type CommonChatItemProps = ExtensionChatItemProps & {
  children: JSX.Element | ((derivativesData: DerivativesData) => JSX.Element)
  myMessageConfig?: MyMessageConfig
  othersMessage?: OthersMessageConfig
  className?: string
  textColor?: string
  bg?: 'background' | 'background-light'
}

const defaultMyMessageConfig: MyMessageConfig = {
  children: 'bottom',
  checkMark: 'adaptive-inside',
}
const defaultOthersMessageConfig: OthersMessageConfig = {
  children: 'bottom',
  checkMark: 'bottom',
}
export default function CommonChatItem({
  myMessageConfig = defaultMyMessageConfig,
  othersMessage = defaultOthersMessageConfig,
  message,
  children,
  scrollToMessage,
  textColor,
  className,
  isMyMessage: _isMyMessage,
  chatId,
  hubId,
  bg = 'background',
}: CommonChatItemProps) {
  const myAddress = useMyMainAddress()
  const { struct, content } = message
  const { ownerId, createdAtTime, dataType, isUpdated } = struct
  const { body } = content || {}
  const repliedMessageId = getRepliedMessageId(message)
  const { data: superLikeCount } = getSuperLikeCountQuery.useQuery(message.id)

  const isMyMessage = _isMyMessage ?? ownerId === myAddress
  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const isSent = isMessageSent(message.id, dataType)

  const childrenElement =
    typeof children === 'function'
      ? children({ isMyMessage, relativeTime, isSent })
      : children

  const otherMessageCheckMarkElement = (className?: string) => (
    <ChatRelativeTime
      isUpdated={isUpdated}
      createdAtTime={createdAtTime}
      className={cx(
        'text-xs text-text-muted',
        isMyMessage && 'text-text-muted-on-primary-light',
        className
      )}
    />
  )
  const myMessageCheckMarkElement = ({
    className,
    timeClassName,
  }: {
    className?: string
    timeClassName?: string
  }) => (
    <div className={cx('flex items-center gap-1 self-end', className)}>
      <ChatRelativeTime
        isUpdated={isUpdated}
        createdAtTime={createdAtTime}
        className={cx(
          'text-xs text-text-muted-on-primary-light',
          isMyMessage && 'text-text-muted-on-primary-light',
          timeClassName
        )}
      />
      <MessageStatusIndicator message={message} />
    </div>
  )

  const isOthersMessageChildrenOnBottom =
    !isMyMessage &&
    (superLikeCount?.count ?? 0) <= 0 &&
    (othersMessage.children === 'bottom' ||
      (othersMessage.children === 'middle' && !body))

  const isMyMessageChildrenOnBottom =
    isMyMessage &&
    (superLikeCount?.count ?? 0) <= 0 &&
    (myMessageConfig.children === 'bottom' ||
      (myMessageConfig.children === 'middle' && !body))

  return (
    <div className={cx('relative flex flex-col gap-2')}>
      {isMyMessage && myMessageConfig.checkMark === 'adaptive-inside' && (
        <div
          className={cx(
            'absolute bottom-1 right-1.5 z-10 flex items-center gap-1 self-end rounded-full px-1.5 py-0.5',
            isMyMessageChildrenOnBottom && 'bg-black/45'
          )}
        >
          {myMessageCheckMarkElement(
            isMyMessageChildrenOnBottom
              ? { className: 'text-white', timeClassName: 'text-white' }
              : {}
          )}
        </div>
      )}
      {!isMyMessage && othersMessage.checkMark === 'bottom' && (
        <div
          className={cx(
            'absolute bottom-1 right-1.5 z-10 flex items-center gap-1 self-end rounded-full px-1.5 py-0.5',
            isOthersMessageChildrenOnBottom && 'bg-black/35'
          )}
        >
          {otherMessageCheckMarkElement(
            cx(isOthersMessageChildrenOnBottom && 'text-white')
          )}
        </div>
      )}
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:bg-background-primary/70 dark:text-text-on-primary'
            : bg === 'background'
            ? 'bg-background'
            : 'bg-background-light',
          className
        )}
      >
        {!isMyMessage && (
          <div
            className={cx(
              'flex items-baseline gap-2 overflow-hidden px-2.5 first:pt-1.5',
              othersMessage.checkMark !== 'top' && 'justify-between'
            )}
          >
            <ProfilePreviewModalName
              clipText
              showModeratorChip
              labelingData={{ chatId }}
              messageId={message.id}
              address={ownerId}
              color={textColor}
              className={cx('text-sm font-medium text-text-secondary')}
            />
            <SubTeamLabel address={ownerId} />
            {othersMessage.checkMark === 'top' &&
              otherMessageCheckMarkElement()}
          </div>
        )}

        {isMyMessage && myMessageConfig.children === 'top' && childrenElement}

        {repliedMessageId && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className={cx(
              'mx-2.5 my-1',
              isMyMessage && myMessageConfig.children !== 'top' && 'mt-2.5'
            )}
            repliedMessageId={repliedMessageId}
            scrollToMessage={scrollToMessage}
            textColor={textColor}
            chatId={chatId}
            hubId={hubId}
          />
        )}

        {isMyMessage && myMessageConfig.children === 'middle' && (
          <div className='relative'>
            {childrenElement}
            {isMyMessage && myMessageConfig.checkMark === 'share' && (
              <div
                className={cx(
                  'absolute bottom-2 right-1.5 z-10 flex items-center gap-1 self-end rounded-full bg-black/45 px-1.5 py-0.5'
                )}
              >
                {myMessageCheckMarkElement({
                  className: 'text-white',
                  timeClassName: 'text-white',
                })}
              </div>
            )}
          </div>
        )}
        {!isMyMessage && othersMessage.children === 'middle' && childrenElement}

        {body && (
          <p
            className={cx(
              'whitespace-pre-wrap break-words px-2.5 text-base first:pt-1.5 last:pb-1.5'
            )}
          >
            <Linkify
              options={{
                render: ({ content, attributes }) => (
                  <LinkText
                    {...attributes}
                    href={attributes.href}
                    variant={isMyMessage ? 'default' : 'secondary'}
                    className={cx('underline')}
                    openInNewTab
                    onClick={(e) => {
                      e.stopPropagation()
                      attributes.onClick?.(e)
                    }}
                  >
                    {content}
                  </LinkText>
                ),
              }}
            >
              {body}
            </Linkify>
            {!isMyMessage && othersMessage.checkMark === 'bottom' && (
              <span className='pointer-events-none ml-3 select-none opacity-0'>
                {otherMessageCheckMarkElement()}
              </span>
            )}
          </p>
        )}

        {!isMyMessage && othersMessage.children === 'bottom' && childrenElement}

        {isMyMessage &&
          myMessageConfig.children === 'bottom' &&
          childrenElement}

        {myMessageConfig.checkMark === 'share' && isMyMessage ? (
          <div className='mb-1.5 mt-1 flex items-center gap-4 px-2.5'>
            <SuperLike
              isMyMessage={isMyMessage}
              withPostReward
              postId={message.id}
              className='self-start'
            />
            <FloatingMenus
              menus={[
                { text: 'Farcaster', icon: Farcaster },
                { text: 'Twitter', icon: FaXTwitter },
              ]}
              placement='top-end'
              panelSize='sm'
              mainAxisOffset={6}
              showOnHover
            >
              {(config) => {
                return (
                  <Button
                    {...config?.referenceProps}
                    onClick={(e) => {
                      e.stopPropagation()
                      config?.onClick?.(e)
                    }}
                    variant='primary'
                    size='sm'
                    className='ml-auto flex items-center gap-2 bg-white px-2 py-0.5 text-sm'
                  >
                    <GrShareOption className='text-[#0053FF]' />
                    <span className='relative -top-px bg-gradient-to-br from-[#0053FF] to-[#6C9AFB] bg-clip-text font-medium text-transparent'>
                      Share to earn
                    </span>
                  </Button>
                )
              }}
            </FloatingMenus>
          </div>
        ) : (
          <SuperLike
            isMyMessage={isMyMessage}
            withPostReward
            postId={message.id}
            className='mb-1.5 ml-2.5 mt-1 self-start'
          />
        )}
      </div>
    </div>
  )
}
