import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ChatLoadingProps = ComponentProps<'div'>

export default function ChatLoading({ ...props }: ChatLoadingProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex items-center justify-center gap-4 overflow-hidden',
        props.className
      )}
    >
      <div className='relative h-4 w-4'>
        <div className='absolute inset-0 h-4 w-4 animate-spin rounded-full border-b-2 border-background-lightest' />
      </div>
      <span className='text-sm text-text-muted'>Loading...</span>
    </div>
  )
}
