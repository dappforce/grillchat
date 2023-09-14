import { cx } from '@/utils/class-names'
import { Transition } from '@headlessui/react'
import { cva, VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'
import { Toast as ToastId } from 'react-hot-toast'

const toastStyles = cva(
  'flex max-w-lg items-start rounded-2xl p-3 text-text shadow-xl ring-1 ring-black ring-opacity-5',
  {
    variants: {
      type: {
        default: 'border border-border-gray bg-background-lighter',
        error: 'border border-text-red bg-background-red text-text-red',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  }
)

export type ToastProps = VariantProps<typeof toastStyles> & {
  t: ToastId
  title: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  action?: React.ReactNode
  icon?: (className: string) => JSX.Element
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
    <Transition
      appear
      show={t.visible}
      className='relative top-12'
      enter={cx('transition duration-150')}
      enterFrom={cx('-translate-y-6 opacity-0')}
      enterTo={cx('translate-y-0 opacity-100')}
      leave={cx('transition duration-150')}
      leaveFrom={cx('translate-y-0 opacity-100')}
      leaveTo={cx('-translate-y-6 opacity-0')}
    >
      <div className={cx(toastStyles({ type }), isTitleOnly && 'items-center')}>
        {icon?.(cx('text-3xl mr-2.5 text-text-muted')) ?? type === 'error'
          ? '😥'
          : 'ℹ️'}
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
          <div className='ml-2 flex-shrink-0 self-center text-text'>
            {action}
          </div>
        )}
      </div>
    </Transition>
  )
}
