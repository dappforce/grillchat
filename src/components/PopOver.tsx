import { offset, useFloating } from '@floating-ui/react-dom'
import { Popover, Transition } from '@headlessui/react'
import { HiXMark } from 'react-icons/hi2'
import Button from './Button'

export interface PopOverProps {
  children: any
  trigger: any
  asButton?: boolean
  withCloseButton?: boolean
}

export default function PopOver({
  children,
  trigger,
  asButton = false,
  withCloseButton,
}: PopOverProps) {
  const { x, y, strategy, refs } = useFloating({
    placement: 'bottom-end',
    middleware: [offset({ mainAxis: 20 })],
  })

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
          className='absolute z-30 flex max-w-sm items-center rounded-3xl bg-background-warning py-4 px-6 font-bold text-text-dark'
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
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
