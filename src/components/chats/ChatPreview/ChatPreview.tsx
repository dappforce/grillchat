import PinIcon from '@/assets/icons/pin.png'
import Container from '@/components/Container'
import { cx } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import Image, { ImageProps } from 'next/image'
import Link, { LinkProps } from 'next/link'
import { ComponentProps } from 'react'
import ChatLastMessage from './ChatLastMessage'
import ChatLastMessageTime from './ChatLastMessageTime'

const ChatUnreadCount = dynamic(() => import('./ChatUnreadCount'), {
  ssr: false,
})

export type ChatPreviewProps = ComponentProps<'div'> & {
  title: string
  description: string
  image: ImageProps['src']
  asLink?: LinkProps
  isInteractive?: boolean
  postId?: string
  isPinned?: boolean
  withUnreadCount?: boolean
  asContainer?: boolean
}

export default function ChatPreview({
  title,
  description,
  image,
  asContainer,
  asLink,
  isPinned,
  postId,
  isInteractive,
  withUnreadCount,
  ...props
}: ChatPreviewProps) {
  const Component = asContainer ? Container<'div'> : 'div'
  const ContentContainer = asLink ? Link : 'div'

  return (
    <Component
      {...props}
      tabIndex={!asLink && isInteractive ? 0 : undefined}
      className={cx(
        'outline-none md:rounded-md',
        (isInteractive || asLink) &&
          'cursor-pointer transition focus-within:bg-background-light/75 hover:bg-background-light/75',
        props.className
      )}
    >
      <ContentContainer
        {...(asLink as any)}
        className={cx(
          'relative flex items-stretch gap-2.5 overflow-hidden py-2 outline-none'
        )}
      >
        <div className='h-14 w-14 rounded-full bg-background-lighter'>
          {image && (
            <Image
              className='h-full w-full rounded-full'
              src={image}
              width={56}
              height={56}
              alt={title ?? 'chat preview'}
            />
          )}
        </div>
        <div className='flex flex-1 items-center overflow-hidden'>
          <div className='flex flex-1 flex-col gap-1 overflow-hidden'>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{title}</span>
              {isPinned ? (
                <Image
                  src={PinIcon}
                  alt='pin'
                  width={16}
                  height={16}
                  className='ml-2 h-4 w-4 flex-shrink-0'
                />
              ) : (
                postId && (
                  <ChatLastMessageTime
                    postId={postId}
                    className='text-sm text-text-muted'
                  />
                )
              )}
            </div>
            <div className='flex items-baseline justify-between overflow-hidden'>
              {postId ? (
                <ChatLastMessage
                  className='py-0.5'
                  defaultDesc={description}
                  postId={postId}
                />
              ) : (
                <p
                  className={cx(
                    'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
                    props.className
                  )}
                >
                  {description}
                </p>
              )}
              {withUnreadCount && postId && (
                <ChatUnreadCount className='ml-2' postId={postId} />
              )}
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 ml-16 w-full border-b border-border-gray' />
      </ContentContainer>
    </Component>
  )
}
