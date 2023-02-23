import { offset, useFloating } from '@floating-ui/react-dom'
import { Popover, Transition } from '@headlessui/react'

export interface PopOverProps {
  children: any
  trigger: any
  asButton?: boolean
}

export default function PopOver({
  children,
  trigger,
  asButton = false,
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
          className='absolute z-30 max-w-sm rounded-3xl bg-background-warning p-4 font-bold text-text-dark'
        >
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
