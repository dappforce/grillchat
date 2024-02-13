import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import ChatRelativeTime from '@/components/chats/ChatItem/ChatRelativeTime'
import MessageStatusIndicator from '@/components/chats/ChatItem/MessageStatusIndicator'
import RepliedMessagePreview from '@/components/chats/ChatItem/RepliedMessagePreview'
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
  children?: 'top' | 'bottom' | 'middle'
  checkMark?: 'outside' | 'inside' | 'adaptive-inside'
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
}: CommonChatItemProps) {
  const myAddress = useMyMainAddress()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const { struct, content } = message
  const { ownerId, createdAtTime, dataType, isUpdated } = struct
  const { inReplyTo, body } = content || {}

  const isMyMessage = true
  // _isMyMessage ?? (ownerId === myAddress || parentProxyAddress === ownerId)
  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const isSent = isMessageSent(message.id, dataType)

  const childrenElement =
    typeof children === 'function'
      ? children({ isMyMessage, relativeTime, isSent })
      : children

  const otherMessageCheckMarkElement = (
    <ChatRelativeTime
      isUpdated={isUpdated}
      createdAtTime={createdAtTime}
      className={cx(
        'text-xs text-text-muted',
        isMyMessage && 'dark:text-text-muted-on-primary'
      )}
    />
  )
  const myMessageCheckMarkElement = (className?: string) => (
    <div className={cx('flex items-center gap-1 self-end', className)}>
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

  if (!body) {
    myMessageConfig.checkMark = 'outside'
  }

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
          <div className='flex items-baseline overflow-hidden px-2.5 first:pt-1.5'>
            <ProfilePreviewModalName
              clipText
              showModeratorChip
              labelingData={{ chatId }}
              messageId={message.id}
              address={ownerId}
              color={textColor}
              className={cx('mr-2 text-sm font-medium text-text-secondary')}
            />
            {!isMyMessage &&
              othersMessage.checkMark === 'top' &&
              otherMessageCheckMarkElement}
          </div>
        )}

        {/** Put on top of body because it will cause the p to not be last child and mess up the padding */}
        {isMyMessage && myMessageConfig.checkMark === 'adaptive-inside' && (
          <div
            className={cx(
              'absolute bottom-1 right-1.5 z-10 flex items-center gap-1 self-end rounded-full bg-background-primary-light px-1.5 py-0.5'
            )}
          >
            {myMessageCheckMarkElement()}
          </div>
        )}
        {!isMyMessage && othersMessage.checkMark === 'bottom' && (
          <div
            className={cx(
              'absolute bottom-1 right-1.5 z-10 flex items-center gap-1 self-end rounded-full bg-background-light px-1.5 py-0.5'
            )}
          >
            {otherMessageCheckMarkElement}
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

        {isMyMessage &&
          myMessageConfig.children === 'middle' &&
          childrenElement}
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
                {otherMessageCheckMarkElement}
              </span>
            )}
          </p>
        )}

        {!isMyMessage && othersMessage.children === 'bottom' && childrenElement}

        {isMyMessage &&
          myMessageConfig.children === 'bottom' &&
          childrenElement}

        {isMyMessage &&
          myMessageConfig.checkMark === 'inside' &&
          myMessageCheckMarkElement('px-2.5 last:pb-1.5')}
      </div>

      {isMyMessage &&
        myMessageConfig.checkMark === 'outside' &&
        myMessageCheckMarkElement('px-2.5 last:pb-1.5')}
    </div>
  )
}
