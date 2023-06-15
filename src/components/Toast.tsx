import { cx } from '@/utils/class-names'
import { Transition } from '@headlessui/react'
import { Toast as ToastId } from 'react-hot-toast'

export type ToastProps = {
  t: ToastId
  title: string
  description?: string
  action?: React.ReactNode
  icon?: (className: string) => JSX.Element
}

export default function Toast({
  t,
  icon,
  title,
  action,
  description,
}: ToastProps) {
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
      <div
        className={cx(
          'flex max-w-lg items-center rounded-full border border-border-gray bg-background-light px-4 py-3 text-text shadow-xl ring-1 ring-black ring-opacity-5'
        )}
      >
        {icon?.(cx('text-3xl mr-2.5'))}
        <div className={cx('flex flex-col')}>
          <p className={cx(!description && 'text-sm')}>{title}</p>
          {description && (
            <p className='text-sm text-text-muted'>{description}</p>
          )}
        </div>
        {action}
      </div>
    </Transition>
  )
}
