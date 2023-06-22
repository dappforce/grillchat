import PinIcon from '@/assets/icons/pin.png'
import Container from '@/components/Container'
import { cx, getCommonClassNames } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import Image, { ImageProps } from 'next/image'
import Link, { LinkProps } from 'next/link'
import React, { ComponentProps } from 'react'
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
  isImageCircle?: boolean
  additionalDesc?: string
  asLink?: LinkProps
  isInteractive?: boolean
  chatId?: string
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
  isImageCircle = true,
  additionalDesc,
  asContainer,
  asLink,
  isPinned,
  chatId,
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
        <div className='flex items-center gap-1'>
          {chatId && (
            <ChatLastMessageTime
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
        <div
          style={{ backgroundClip: 'padding-box' }}
          className={cx(
            getCommonClassNames('chatImageBackground'),
            isImageCircle ? 'rounded-full' : 'rounded-2xl',
            'h-12 w-12 self-center sm:h-14 sm:w-14'
          )}
        >
          {React.isValidElement(image)
            ? image
            : image && (
                <Image
                  className='h-full w-full object-cover'
                  src={image as string}
                  sizes='150px'
                  width={56}
                  height={56}
                  alt={title ?? 'chat preview'}
                />
              )}
        </div>
        <div className='flex flex-1 items-center overflow-hidden'>
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='flex items-center justify-between'>
              {title && <span className='font-medium'>{title}</span>}
              {renderAdditionalData()}
            </div>
            <div className='mt-1 flex items-baseline justify-between overflow-hidden'>
              {chatId && hubId ? (
                <ChatLastMessage
                  hubId={hubId}
                  className='py-0.5'
                  defaultDesc={description ?? ''}
                  chatId={chatId}
                />
              ) : (
                <p
                  className={cx(
                    'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted'
                  )}
                >
                  {description}
                </p>
              )}
              {withUnreadCount && chatId && (
                <ChatUnreadCount className='ml-2' chatId={chatId} />
              )}
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
