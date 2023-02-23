import { cx } from '@/utils/className'
import { arrow, offset, useFloating } from '@floating-ui/react-dom'
import { Popover, Transition } from '@headlessui/react'
import { useRef } from 'react'
import { HiXMark } from 'react-icons/hi2'
import Button from './Button'

export interface PopOverProps {
  children: any
  trigger: any
  asButton?: boolean
  withCloseButton?: boolean
  withArrow?: boolean
}

export default function PopOver({
  children,
  trigger,
  asButton = false,
  withCloseButton,
  withArrow = true,
}: PopOverProps) {
  const arrowRef = useRef(null)
  const { x, y, strategy, refs, middlewareData } = useFloating({
    placement: 'bottom-end',
    middleware: [
      offset({ mainAxis: 20 }),
      withArrow &&
        arrow({
          element: arrowRef,
          padding: 12,
        }),
    ],
  })

  // create custom background if needed
  const backgroundColor = cx('bg-background-warning')

  const { x: arrowX, y: arrowY } = middlewareData?.arrow || { x: 0, y: 0 }

  return (
    <Popover className='relative'>
      <Popover.Button as={!asButton ? 'div' : 'button'} ref={refs.setReference}>
        {trigger}
      </Popover.Button>

      <Transition
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Popover.Panel
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          className={cx(
            'absolute z-30 flex max-w-sm items-center rounded-3xl py-4 px-6 font-bold text-text-dark',
            backgroundColor
          )}
        >
          <div>{children}</div>
          {withCloseButton && (
            <Button
              className='py-1 pl-4 pr-0 text-2xl text-current'
              variant='transparent'
            >
              <HiXMark />
            </Button>
          )}
          {withArrow && (
            <div
              className={cx(
                'translate h-5 !w-5 -translate-y-0.5 rotate-45',
                backgroundColor
              )}
              style={{
                position: 'absolute',
                top: arrowY ?? 0,
                left: arrowX ?? 0,
                width: 'max-content',
              }}
              ref={arrowRef}
            />
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
