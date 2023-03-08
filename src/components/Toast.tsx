import { cx } from '@/utils/className'
import { Transition } from '@headlessui/react'
import { Toast as ToastId } from 'react-hot-toast'

export type ToastProps = {
  t: ToastId
  title: string
  description?: string
  icon?: (classNames: string) => JSX.Element
}

export default function Toast({ t, icon, title, description }: ToastProps) {
  return (
    <Transition
      appear
      show={t.visible}
      enter={cx('transition duration-150')}
      enterFrom={cx('translate-x-6 opacity-0')}
      enterTo={cx('translate-x-0 opacity-100')}
      leave={cx('transition duration-150')}
      leaveFrom={cx('translate-x-0 opacity-100')}
      leaveTo={cx('translate-x-6 opacity-0')}
    >
      <div
        className={cx(
          'flex items-center rounded-xl border border-border-gray bg-background-light px-4 py-3 text-text shadow-xl ring-1 ring-black ring-opacity-5'
        )}
      >
        {icon && icon(cx('text-3xl mr-2.5'))}
        <div className={cx('flex flex-col')}>
          <p>{title}</p>
          {description && (
            <p className='text-sm text-text-muted'>{description}</p>
          )}
        </div>
      </div>
    </Transition>
  )
}
