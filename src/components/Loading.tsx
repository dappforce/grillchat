import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type LoadingProps = ComponentProps<'div'> & {
  spinnerClassName?: string
  textClassName?: string
}

export default function Loading({
  spinnerClassName,
  textClassName,
  ...props
}: LoadingProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex items-center justify-center gap-4 overflow-hidden',
        props.className
      )}
    >
      <div className='relative h-4 w-4'>
        <div
          className={cx(
            'absolute inset-0 h-4 w-4 animate-spin rounded-full border-b-2 border-background-lightest',
            spinnerClassName
          )}
        />
      </div>
      <span className={cx('text-sm text-text-muted', textClassName)}>
        Loading...
      </span>
    </div>
  )
}
