import { cx } from '@/utils/className'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { HiXMark } from 'react-icons/hi2'
import Button from './Button'

export type ModalFunctionalityProps = {
  isOpen: boolean
  closeModal: () => void
}

export type ModalProps = ModalFunctionalityProps & {
  withCloseButton?: boolean
  children: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
}

export default function Modal({
  children,
  closeModal,
  withCloseButton,
  isOpen,
  title,
  description,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10 text-text' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                className={cx(
                  'relative w-full max-w-lg overflow-hidden rounded-3xl bg-background-light',
                  'p-8 text-left align-middle shadow-xl',
                  'transform transition-all',
                  'flex flex-col'
                )}
              >
                {withCloseButton && (
                  <Button
                    className='absolute right-8 m-1 mr-0 p-0 text-2xl text-text-muted'
                    variant='transparent'
                    onClick={closeModal}
                  >
                    <HiXMark />
                  </Button>
                )}
                {title && (
                  <Dialog.Title as='h3' className={cx('mb-4 text-2xl')}>
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className={cx('mb-4 text-text-muted')}>
                    {description}
                  </Dialog.Description>
                )}

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
