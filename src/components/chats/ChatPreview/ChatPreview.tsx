import PinIcon from '@/assets/icons/pin.png'
import Container from '@/components/Container'
import { SortChatOption } from '@/modules/chat/hooks/useSortedChats'
import { cx } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import Image, { ImageProps } from 'next/image'
import Link, { LinkProps } from 'next/link'
import { ComponentProps } from 'react'
import ChatImage, { ChatImageProps } from '../ChatImage'
import ChatModerateChip from '../ChatModerateChip'
import ChatLastMessage from './ChatLastMessage'

// dynamic import to prevent hydration mismatch
const ChatUnreadCount = dynamic(() => import('./ChatUnreadCount'), {
  ssr: false,
})
const ChatLastMessageTime = dynamic(() => import('./ChatLastMessageTime'), {
  ssr: false,
})

export type ChatPreviewProps = ComponentProps<'div'> & {
  title: string | undefined
  description: string | undefined
  image: ImageProps['src'] | JSX.Element | undefined
  isImageInCidFormat?: boolean
  rounding?: ChatImageProps['rounding']
  additionalDesc?: string
  asLink?: LinkProps
  isInteractive?: boolean
  isHidden?: boolean
  chatId?: string
  chatInfo?: SortChatOption
  hubId?: string
  isPinned?: boolean
  withUnreadCount?: boolean
  asContainer?: boolean
  withBorderBottom?: boolean
  withFocusedStyle?: boolean
}

export default function ChatPreview({
  title,
  description,
  image,
  rounding,
  isImageInCidFormat = true,
  additionalDesc,
  asContainer,
  chatInfo,
  asLink,
  isPinned,
  chatId,
  isHidden,
  hubId,
  isInteractive,
  withUnreadCount,
  withBorderBottom = true,
  withFocusedStyle,
  ...props
}: ChatPreviewProps) {
  const Component = asContainer ? Container<'div'> : 'div'
  const ContentContainer = asLink ? Link : 'div'

  const renderAdditionalData = () => {
    if (isPinned || chatId) {
      return (
        <div className='flex flex-shrink-0 items-center gap-1'>
          {chatId && (
            <ChatLastMessageTime
              chatInfo={chatInfo}
              chatId={chatId}
              className='text-sm text-text-muted'
            />
          )}
          {isPinned && (
            <Image
              src={PinIcon}
              alt='pin'
              width={16}
              height={16}
              className='ml-2 h-4 w-4 flex-shrink-0'
            />
          )}
        </div>
      )
    } else if (additionalDesc) {
      return <span className='text-sm text-text-muted'>{additionalDesc}</span>
    } else {
      return null
    }
  }

  const defaultDesc = description || (isHidden ? 'Hidden Chat' : title ?? '')

  return (
    <Component
      {...props}
      tabIndex={!asLink && isInteractive ? 0 : undefined}
      className={cx(
        'outline-none md:rounded-md',
        (isInteractive || asLink) &&
          'cursor-pointer transition focus-within:bg-background-light/75 hover:bg-background-light/75',
        withFocusedStyle && 'bg-background-light/75',
        props.className
      )}
    >
      <ContentContainer
        {...(asLink as any)}
        className={cx(
          'relative flex items-stretch gap-2.5 overflow-hidden py-2 outline-none'
        )}
      >
        <ChatImage
          chatId={chatId}
          chatTitle={title ?? ''}
          image={image}
          rounding={rounding}
          isImageInCidFormat={isImageInCidFormat}
          className='self-center sm:h-14 sm:w-14'
        />
        <div className='flex flex-1 items-center overflow-hidden'>
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='flex items-center justify-between gap-2 overflow-hidden'>
              <div className='flex items-center gap-2 overflow-hidden'>
                <span className='overflow-hidden text-ellipsis whitespace-nowrap font-medium'>
                  {title || 'Untitled'}
                </span>
                {chatId && <ChatModerateChip chatId={chatId} />}
              </div>
              {renderAdditionalData()}
            </div>
            <div className='mt-0.5 flex items-baseline justify-between overflow-hidden'>
              {chatId && hubId ? (
                <ChatLastMessage
                  hubId={hubId}
                  className='py-0.5'
                  defaultDesc={defaultDesc}
                  chatId={chatId}
                />
              ) : (
                <p
                  className={cx(
                    'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted'
                  )}
                >
                  {defaultDesc}
                </p>
              )}
              {(() => {
                if (withUnreadCount && chatId) {
                  return <ChatUnreadCount className='ml-2' chatId={chatId} />
                }

                return null
              })()}
            </div>
          </div>
        </div>
        {withBorderBottom && (
          <div className='absolute bottom-0 ml-14 w-full border-b border-border-gray sm:ml-16' />
        )}
      </ContentContainer>
    </Component>
  )
}
