import { cx } from '@/utils/class-names'
import {
  arrow,
  autoUpdate,
  FloatingFocusManager,
  offset,
  Placement,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { Transition } from '@headlessui/react'
import { cva, VariantProps } from 'class-variance-authority'
import { useRef, useState } from 'react'
import { HiXMark } from 'react-icons/hi2'
import Button from './Button'

const panelStyles = cva(
  'absolute z-30 flex max-w-sm items-center rounded-3xl text-text-dark',
  {
    variants: {
      panelSize: {
        sm: 'py-2 px-4 text-xs',
        md: 'py-4 px-6',
      },
    },
    defaultVariants: {
      panelSize: 'md',
    },
  }
)

const panelColors = {
  warning: cx('bg-background-warning text-text-dark'),
  default: cx('text-text bg-background-lightest'),
}

export type PopOverProps = VariantProps<typeof panelStyles> & {
  children: React.ReactNode
  trigger: React.ReactNode
  asButton?: boolean
  withCloseButton?: boolean
  withArrow?: boolean
  placement?: Placement
  yOffset?: number
  panelColor?: keyof typeof panelColors
  triggerClassName?: string
  popOverClassName?: string
  manualTrigger?: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  triggerOnHover?: boolean
  initialFocus?: Parameters<typeof FloatingFocusManager>[0]['initialFocus']
}

export default function PopOver({
  children,
  trigger,
  asButton = false,
  withCloseButton,
  withArrow = true,
  placement = 'bottom',
  yOffset = 0,
  panelSize,
  panelColor = 'default',
  popOverClassName,
  triggerClassName,
  triggerOnHover,
  manualTrigger,
  initialFocus,
}: PopOverProps) {
  const [_isOpen, _setIsOpen] = useState(false)
  const isOpen = manualTrigger?.isOpen ?? _isOpen
  const setIsOpen = manualTrigger?.setIsOpen ?? _setIsOpen

  const arrowRef = useRef(null)
  const { x, y, strategy, refs, middlewareData, context } = useFloating({
    open: isOpen,
    placement,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: yOffset }),
      withArrow &&
        arrow({
          element: arrowRef,
          padding: 12,
        }),
    ],
  })

  const hover = useHover(context, { enabled: !!triggerOnHover })
  const click = useClick(context, { enabled: !triggerOnHover })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    click,
    role,
  ])

  // create custom background if needed
  const color = panelColors[panelColor]

  const { x: arrowX, y: arrowY } = middlewareData?.arrow || { x: 0, y: 0 }
  const isArrowPlacementOnBottom = placement.startsWith('bottom')

  const TriggerElement = !asButton ? 'div' : 'button'

  return (
    <>
      <TriggerElement
        className={cx('flex items-center', triggerClassName)}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {trigger}
      </TriggerElement>
      {isOpen && (
        <FloatingFocusManager
          initialFocus={initialFocus}
          context={context}
          modal={false}
        >
          <Transition
            enter='transition duration-100 ease-out'
            enterFrom='transform scale-95 opacity-0'
            enterTo='transform scale-100 opacity-100'
            leave='transition duration-75 ease-out'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform scale-95 opacity-0'
            show={isOpen}
          >
            <div
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
              }}
              ref={refs.setFloating}
              className={cx(
                'absolute z-30 flex max-w-sm items-center rounded-3xl py-4 px-6 text-text-dark',
                'shadow-md outline-none',
                panelStyles({ panelSize }),
                color,
                popOverClassName
              )}
              {...getFloatingProps()}
            >
              <div className='relative z-10'>{children}</div>
              {withCloseButton && (
                <Button
                  onClick={() => setIsOpen(false)}
                  className='my-1 ml-4 mr-0 p-0 text-2xl text-current'
                  variant='transparent'
                >
                  <HiXMark />
                </Button>
              )}
              {withArrow && (
                <div
                  className={cx(
                    'translate h-5 !w-5 rotate-45',
                    isArrowPlacementOnBottom
                      ? '-translate-y-0.5'
                      : 'translate-y-0.5',
                    color
                  )}
                  style={{
                    position: 'absolute',
                    top: isArrowPlacementOnBottom ? arrowY ?? 0 : 'auto',
                    bottom: isArrowPlacementOnBottom ? 'auto' : arrowY ?? 0,
                    left: arrowX ?? 0,
                    width: 'max-content',
                  }}
                  ref={arrowRef}
                />
              )}
            </div>
          </Transition>
        </FloatingFocusManager>
      )}
    </>
  )
}
