import ChatRelativeTime from '@/components/chats/ChatItem/ChatRelativeTime'
import MessageStatusIndicator from '@/components/chats/ChatItem/MessageStatusIndicator'
import RepliedMessagePreview from '@/components/chats/ChatItem/RepliedMessagePreview'
import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import { isMessageSent } from '@/services/subsocial/commentIds/optimistic'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import Linkify from 'linkify-react'
import { ExtensionChatItemProps } from '../types'

type DerivativesData = {
  isMyMessage: boolean
  relativeTime: string
  isSent: boolean
}

type MyMessageConfig = {
  children?: 'top' | 'bottom'
  checkMark?: 'outside' | 'inside'
}
type OthersMessageConfig = {
  children?: 'bottom'
}

type CommonChatItemProps = ExtensionChatItemProps & {
  children: JSX.Element | ((derivativesData: DerivativesData) => JSX.Element)
  myMessageConfig?: MyMessageConfig
  othersMessage?: OthersMessageConfig
  className?: string
  textColor?: string
}

const defaultMyMessageConfig: MyMessageConfig = {
  children: 'bottom',
  checkMark: 'inside',
}
const defaultOthersMessageConfig: OthersMessageConfig = {
  children: 'bottom',
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
}: CommonChatItemProps) {
  const myAddress = useMyMainAddress()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const { struct, content } = message
  const { ownerId, createdAtTime, dataType, isUpdated } = struct
  const { inReplyTo, body } = content || {}

  const isMyMessage =
    _isMyMessage ?? (ownerId === myAddress || parentProxyAddress === ownerId)
  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const isSent = isMessageSent(message.id, dataType)

  const childrenElement =
    typeof children === 'function'
      ? children({ isMyMessage, relativeTime, isSent })
      : children

  const checkMarkElement = (
    <div
      className={cx(
        'flex items-center gap-1 px-2.5 last:pb-1.5',
        isMyMessage && 'self-end'
      )}
    >
      <ChatRelativeTime
        isUpdated={isUpdated}
        createdAtTime={createdAtTime}
        className={cx(
          'text-xs text-text-muted',
          isMyMessage && 'dark:text-text-muted-on-primary'
        )}
      />
      <MessageStatusIndicator message={message} />
    </div>
  )

  return (
    <div className={cx('flex flex-col gap-2')}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:bg-background-primary dark:text-text-on-primary'
            : 'bg-background-light',
          className
        )}
      >
        {!isMyMessage && (
          <div className='flex items-baseline px-2.5 first:pt-1.5'>
            <ProfilePreviewModalName
              showModeratorChip
              labelingData={{ chatId }}
              messageId={message.id}
              address={ownerId}
              color={textColor}
              className={cx('mr-2 text-sm font-medium text-text-secondary')}
            />
            <ChatRelativeTime
              isUpdated={isUpdated}
              createdAtTime={createdAtTime}
              className='text-xs text-text-muted'
              style={{ color: textColor }}
            />
          </div>
        )}

        {isMyMessage && myMessageConfig.children === 'top' && childrenElement}

        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className='mx-2.5 my-1 first:mt-2.5'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
            textColor={textColor}
            chatId={chatId}
            hubId={hubId}
          />
        )}

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
          </p>
        )}

        {!isMyMessage && othersMessage.children === 'bottom' && childrenElement}

        {isMyMessage &&
          myMessageConfig.children === 'bottom' &&
          childrenElement}

        {isMyMessage &&
          myMessageConfig.checkMark === 'inside' &&
          checkMarkElement}
      </div>

      {isMyMessage &&
        myMessageConfig.checkMark === 'outside' &&
        checkMarkElement}
    </div>
  )
}
