import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import MessageModal from '@/components/modals/MessageModal'
import { getPostQuery } from '@/services/api/query'
import { getSuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import Linkify from 'linkify-react'
import { useState } from 'react'
import SuperLike from '../../../content-staking/SuperLike'
import { ScrollToMessage } from '../../ChatList/hooks/useScrollToMessage'
import ChatRelativeTime from '../ChatRelativeTime'
import LinkPreview from '../LinkPreview'
import MessageStatusIndicator from '../MessageStatusIndicator'
import RepliedMessagePreview from '../RepliedMessagePreview'
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
  const showSuperLike = (superLikeCount?.count ?? 0) > 0

  const { createdAtTime, ownerId, isUpdated } = message.struct
  const { inReplyTo, body, link, linkMetadata } = message.content || {}

  const relativeTime = (className?: string) => (
    <>
      <ChatRelativeTime
        createdAtTime={createdAtTime}
        isUpdated={isUpdated}
        className={cx(
          'text-xs text-text-muted [&:not(:last-child)]:mr-1',
          isMyMessage && 'text-text-muted-on-primary-light',
          className
        )}
      />
      {isMyMessage && <MessageStatusIndicator message={message} />}
    </>
  )

  const showLinkPreview = link && linkMetadata?.title

  return (
    <div className={cx('flex flex-col', props.className)}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl px-2.5 py-1.5',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:text-text-on-primary'
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
                const baseUrl =
                  currentNetwork === 'xsocial'
                    ? 'https://grill.chat'
                    : 'https://grillapp.net'
                if (href.startsWith(baseUrl)) {
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
          {!showSuperLike && (
            <span
              className={cx(
                'pointer-events-none ml-3 select-none px-1 opacity-0'
              )}
            >
              {relativeTime()}
            </span>
          )}
        </p>
        <div
          className={cx(
            'absolute bottom-0.5 right-2 z-10 flex items-center self-end rounded-full px-1.5 py-0.5',
            !showSuperLike && showLinkPreview && 'bg-black/35'
          )}
        >
          {relativeTime(cx(!showSuperLike && showLinkPreview && '!text-white'))}
        </div>
        {link && linkMetadata?.title && (
          <LinkPreview
            renderNullIfLinkEmbedable
            className={cx('my-1 last:mb-6')}
            link={link}
            linkMetadata={linkMetadata}
            isMyMessage={isMyMessage}
          />
        )}
        <div
          className={cx('mt-1 flex items-center', !showSuperLike && 'hidden')}
        >
          <SuperLike withPostReward postId={message.id} />
          <span className='pointer-events-none ml-4 select-none opacity-0'>
            {relativeTime()}
          </span>
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
