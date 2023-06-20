import Container from '@/components/Container'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ChatPreviewSkeletonProps = ComponentProps<'div'> & {
  asContainer?: boolean
  isImageCircle?: boolean
  withBorderBottom?: boolean
}

function ChatPreviewSkeleton({
  asContainer,
  isImageCircle = true,
  withBorderBottom = true,
  ...props
}: ChatPreviewSkeletonProps) {
  const Component = asContainer ? Container<'div'> : 'div'

  return (
    <Component
      {...props}
      className={cx('outline-none md:rounded-md', props.className)}
    >
      <div
        className={cx(
          'relative flex animate-pulse items-stretch gap-2.5 overflow-hidden py-2 outline-none'
        )}
      >
        <div
          style={{ backgroundClip: 'padding-box' }}
          className={cx(
            'bg-background-light',
            isImageCircle ? 'rounded-full' : 'rounded-2xl',
            'h-12 w-12 self-center sm:h-14 sm:w-14'
          )}
        ></div>
        <div className='flex flex-1 items-center overflow-hidden'>
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='flex items-center justify-between'>
              <span className='my-1 h-4 w-48 rounded-full bg-background-light font-medium' />
              <span className='my-1 h-4 w-24 rounded-full bg-background-light font-medium' />
            </div>
            <div className='mt-1 flex items-baseline justify-between overflow-hidden'>
              <span className='my-1 h-4 w-full rounded-full bg-background-light font-medium' />
            </div>
          </div>
        </div>
        {withBorderBottom && (
          <div className='absolute bottom-0 ml-14 w-full border-b border-border-gray sm:ml-12' />
        )}
      </div>
    </Component>
  )
}

function ChatPreviewSkeletonList({
  amount = 3,
  ...props
}: ComponentProps<'div'> & { amount?: number }) {
  return (
    <div {...props} className={cx('flex flex-col', props.className)}>
      {Array.from({ length: amount }).map((_, idx) => (
        <ChatPreviewSkeleton asContainer key={idx} />
      ))}
    </div>
  )
}

ChatPreviewSkeleton.SkeletonList = ChatPreviewSkeletonList
export default ChatPreviewSkeleton
