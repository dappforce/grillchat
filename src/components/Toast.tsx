import { cx } from '@/utils/class-names'
// import { Transition } from '@headlessui/react'
import { cva, VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'

const toastStyles = cva(
  'flex max-w-lg items-start rounded-2xl p-3 text-text shadow-xl ring-1 ring-black ring-opacity-5 top-12',
  {
    variants: {
      type: {
        default: 'border border-border-gray bg-background-light',
        error: 'border border-text-red bg-background-red text-text-red',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  }
)

export type ToastProps = VariantProps<typeof toastStyles> & {
  t: number | string
  title: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  action?: React.ReactNode
  icon?: (className: string) => ReactNode
}

export default function Toast({
  t,
  icon,
  title,
  action,
  subtitle,
  type,
  description,
}: ToastProps) {
  const isTitleOnly = !description && !subtitle

  return (
    <div className={cx(toastStyles({ type }), isTitleOnly && 'items-center')}>
      {icon?.(cx('text-3xl mr-2.5 text-text-muted flex-shrink-0')) ?? (
        <span className='mr-1'>{type === 'error' ? '😥' : 'ℹ️'}</span>
      )}
      <div className={cx('flex flex-col', !icon && 'mx-2')}>
        <p className={cx(isTitleOnly && 'text-sm')}>{title}</p>
        {subtitle && (
          <p className={cx('mt-0.5 text-sm text-text-muted')}>{subtitle}</p>
        )}
        {description && (
          <p
            className={cx(
              'mt-0.5 text-sm text-text-muted',
              title && subtitle && 'mt-1.5'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className='ml-2 flex-shrink-0 self-center text-text'>{action}</div>
      )}
    </div>
  )
}
