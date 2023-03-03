import { cx } from '@/utils/className'
import Image, { ImageProps } from 'next/image'
import Link, { LinkProps } from 'next/link'
import { ComponentProps } from 'react'
import Container from '../Container'

export type ChatPreviewProps = ComponentProps<'div'> & {
  title: string
  description: string
  image: ImageProps['src']
  asLink?: LinkProps
  isInteractive?: boolean
  lastMessage?: {
    text: string
    date: string
  }
  asContainer?: boolean
}

export default function ChatPreview({
  title,
  description,
  lastMessage,
  image,
  asContainer,
  asLink,
  isInteractive,
  lastMessage: _lastMessage,
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
          'relative flex items-stretch gap-2.5 overflow-hidden py-2 outline-none',
          props.className
        )}
      >
        <Image
          className='h-14 w-14'
          src={image}
          alt={title ?? 'chat preview'}
        />
        <div className='flex flex-1 items-center overflow-hidden'>
          <div className='flex flex-1 flex-col gap-1 overflow-hidden'>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{title}</span>
              <span className='text-sm text-text-muted'>10:11</span>
            </div>
            <div className='flex items-baseline justify-between overflow-hidden'>
              <p className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted'>
                {description}
              </p>
              <span className='ml-2 rounded-full bg-background-primary py-0.5 px-2 text-sm'>
                7
              </span>
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 ml-20 w-full border-b border-border-gray' />
      </ContentContainer>
    </Component>
  )
}
