import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import MessageModal from '@/components/modals/MessageModal'
import { getPostQuery } from '@/services/api/query'
import { getSuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { cx } from '@/utils/class-names'
import Linkify from 'linkify-react'
import { useState } from 'react'
import { ScrollToMessage } from '../../ChatList/hooks/useScrollToMessage'
import ChatRelativeTime from '../ChatRelativeTime'
import LinkPreview from '../LinkPreview'
import MessageStatusIndicator from '../MessageStatusIndicator'
import RepliedMessagePreview from '../RepliedMessagePreview'
import SuperLike from '../SuperLike'
import { ChatItemContentProps } from './types'

export type DefaultChatItemProps = ChatItemContentProps

export default function DefaultChatItem({
  chatId,
  hubId,
  message,
  isMyMessage,
  scrollToMessage,
  ...props
}: DefaultChatItemProps) {
  const messageId = message.id

  const { data: superLikeCount } = getSuperLikeCountQuery.useQuery(messageId)
  const showSuperLikeCount = (superLikeCount?.count ?? 0) > 0

  const { createdAtTime, ownerId, isUpdated } = message.struct
  const { inReplyTo, body, link, linkMetadata } = message.content || {}

  const relativeTime = (
    <>
      <ChatRelativeTime
        createdAtTime={createdAtTime}
        isUpdated={isUpdated}
        className={cx(
          'text-xs text-text-muted',
          isMyMessage && 'dark:text-text-muted-on-primary'
        )}
      />
      {isMyMessage && <MessageStatusIndicator message={message} />}
    </>
  )

  return (
    <div className={cx('flex flex-col', props.className)}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl px-2.5 py-1.5',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:bg-background-primary dark:text-text-on-primary'
            : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-baseline overflow-hidden'>
            <ProfilePreviewModalName
              clipText
              showModeratorChip
              labelingData={{ chatId }}
              messageId={messageId}
              address={ownerId}
              className={cx('text-sm font-medium text-text-secondary')}
            />
          </div>
        )}
        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className='my-1'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
            chatId={chatId}
            hubId={hubId}
          />
        )}
        <p className='whitespace-pre-wrap break-words text-base'>
          <Linkify
            options={{
              render: ({ content, attributes }) => {
                const href = attributes.href || ''
                if (href.startsWith('https://grill.chat')) {
                  content = content.replace(/(https?:\/\/)?(www\.)?/, '')
                }

                const messageLinkRegex =
                  /^(https?:\/\/)?(www\.)?grill\.chat\/([^\/?#]+)\/([^\/?#]+)\/([^\/?#]+)\/?$/i
                const match = href.match(messageLinkRegex)
                const messageId = match?.[5]
                if (messageId) {
                  return (
                    <MessageLink
                      attributes={attributes as any}
                      isMyMessage={isMyMessage}
                      content={content}
                      chatId={chatId}
                      messageId={messageId}
                      hubId={hubId}
                      scrollToMessage={scrollToMessage}
                    />
                  )
                }

                return (
                  <LinkRedirect
                    attributes={attributes as any}
                    content={content}
                    isMyMessage={isMyMessage}
                  />
                )
              },
            }}
          >
            {body}
          </Linkify>
          {!showSuperLikeCount && (
            <span className='ml-3 select-none opacity-0'>{relativeTime}</span>
          )}
        </p>
        {link && linkMetadata?.title && (
          <LinkPreview
            renderNullIfLinkEmbedable
            className={cx('my-1')}
            link={link}
            linkMetadata={linkMetadata}
            isMyMessage={isMyMessage}
          />
        )}
        {showSuperLikeCount && (
          <div className={cx('mt-1 flex items-center')}>
            <SuperLike messageId={message.id} />
            <span className='ml-4 select-none opacity-0'>{relativeTime}</span>
          </div>
        )}
        <div
          className={cx(
            'absolute bottom-1 right-3 flex items-center gap-1 self-end'
          )}
        >
          {relativeTime}
        </div>
      </div>
    </div>
  )
}

type LinkRedirectProps = {
  attributes: { href: string; onClick?: (e: any) => void }
  content: string
  isMyMessage: boolean
}
function LinkRedirect({ attributes, isMyMessage, content }: LinkRedirectProps) {
  return (
    <LinkText
      {...attributes}
      href={attributes.href}
      variant={isMyMessage ? 'secondary-light' : 'secondary'}
      className={cx('underline')}
      openInNewTab
      onClick={(e) => {
        e.stopPropagation()
        attributes.onClick?.(e)
      }}
    >
      {content}
    </LinkText>
  )
}

function MessageLink({
  attributes,
  content,
  isMyMessage,
  messageId,
  hubId,
  scrollToMessage,
  chatId,
}: LinkRedirectProps & {
  messageId: string
  hubId: string
  scrollToMessage?: ScrollToMessage
  chatId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: message } = getPostQuery.useQuery(messageId)

  const isSameChat = message?.struct.rootPostId === chatId

  if (!message) {
    return (
      <LinkRedirect
        attributes={attributes}
        content={content}
        isMyMessage={isMyMessage}
      />
    )
  }

  return (
    <>
      <Button
        size='noPadding'
        onClick={() => setIsOpen(true)}
        className={cx(
          isMyMessage
            ? 'bg-background-lighter/80 text-text-secondary-light dark:bg-background-lighter/50'
            : 'bg-background-lighter text-text-secondary',
          'inline break-all rounded-lg px-2 py-0.5 text-left underline',
          'whitespace-normal hover:brightness-105 focus-visible:brightness-105 dark:hover:brightness-90 dark:focus-visible:brightness-90'
        )}
        interactive='none'
        variant='transparent'
      >
        {content}
      </Button>
      <MessageModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        hubId={hubId}
        messageId={messageId}
        scrollToMessage={isSameChat ? scrollToMessage : undefined}
        redirectTo={isSameChat ? undefined : attributes.href}
      />
    </>
  )
}
