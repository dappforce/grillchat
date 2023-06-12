import { cx } from '@/utils/class-names'
import { Dialog, Transition } from '@headlessui/react'
import { cva, VariantProps } from 'class-variance-authority'
import { Fragment } from 'react'
import { HiOutlineChevronLeft, HiXMark } from 'react-icons/hi2'
import Button from '../Button'
import LinkText from '../LinkText'

export type ModalFunctionalityProps = {
  isOpen: boolean
  closeModal: () => void
}

const panelStyles = cva(
  cx(
    'relative w-full rounded-[20px] bg-background-light',
    'text-left align-middle shadow-xl',
    'transform transition-all',
    'flex flex-col'
  ),
  {
    variants: {
      size: {
        sm: cx('max-w-sm'),
        md: cx('max-w-md'),
        lg: cx('max-w-lg'),
        'screen-md': cx('max-w-screen-md'),
        'screen-lg': cx('max-w-screen-lg'),
        'full-screen': cx('max-w-none'),
      },
    },
    defaultVariants: { size: 'lg' },
  }
)

export type ModalProps = ModalFunctionalityProps &
  VariantProps<typeof panelStyles> & {
    titleClassName?: string
    descriptionClassName?: string
    withCloseButton?: boolean
    children: React.ReactNode
    title?: React.ReactNode
    onBackClick?: () => void
    description?: React.ReactNode
    containerClassName?: string
    panelClassName?: string
    contentClassName?: string
    initialFocus?: React.RefObject<HTMLElement>
    withFooter?: boolean
  }

export default function Modal({
  children,
  titleClassName,
  contentClassName,
  panelClassName,
  containerClassName,
  size,
  descriptionClassName,
  closeModal,
  onBackClick,
  withCloseButton,
  isOpen,
  title,
  description,
  initialFocus,
  withFooter,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        initialFocus={initialFocus}
        className='relative z-40 text-text'
        onClose={closeModal}
      >
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

        <div className='fixed inset-0 w-screen overflow-y-auto'>
          <div
            className={cx(
              'flex min-h-full items-center justify-center p-4 text-center',
              containerClassName
            )}
          >
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
                className={cx(panelStyles({ size }), panelClassName)}
              >
                <div
                  className={cx(
                    'p-6 text-left align-middle',
                    'transform',
                    'flex flex-col',
                    contentClassName
                  )}
                >
                  {withCloseButton && (
                    <Button
                      className='absolute right-6 m-1 mr-0 p-0 text-2xl text-text-muted'
                      variant='transparent'
                      onClick={closeModal}
                    >
                      <HiXMark />
                    </Button>
                  )}
                  {title && (
                    <Dialog.Title
                      as='h3'
                      className={cx(
                        'mb-2 text-2xl md:mb-4',
                        withCloseButton && 'pr-8',
                        titleClassName
                      )}
                    >
                      {onBackClick ? (
                        <div className='flex items-start'>
                          <Button
                            size='circle'
                            variant='transparent'
                            className='-ml-2 mr-2 text-lg'
                            onClick={onBackClick}
                          >
                            <HiOutlineChevronLeft />
                          </Button>
                          <span>{title}</span>
                        </div>
                      ) : (
                        title
                      )}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description
                      className={cx(
                        'mb-4 text-text-muted',
                        descriptionClassName
                      )}
                    >
                      {description}
                    </Dialog.Description>
                  )}

                  {children}
                </div>

                {withFooter && (
                  <div className='flex items-center justify-center gap-4 border-t border-background-lightest px-6 py-5 text-sm text-text-muted'>
                    <LinkText
                      href='https://polkaverse.com/legal/privacy'
                      className='font-normal'
                      openInNewTab
                    >
                      Privacy Policy
                    </LinkText>
                    <span>&middot;</span>
                    <LinkText
                      href='https://polkaverse.com/legal/terms'
                      className='font-normal'
                      openInNewTab
                    >
                      Terms of Service
                    </LinkText>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
