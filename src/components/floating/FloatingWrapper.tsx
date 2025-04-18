import { HOVER_MENU_DELAY_OPT } from '@/constants/interaction'
import { isTouchDevice } from '@/utils/device'
import {
  Alignment,
  FloatingPortal,
  Placement,
  autoPlacement,
  offset,
  safePolygon,
  useClientPoint,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react'
import { Transition } from '@headlessui/react'
import { MouseEvent, MouseEventHandler, useRef, useState } from 'react'

type ReferenceProps = Record<string, unknown>
export type FloatingWrapperProps = {
  children: (config: {
    toggleDisplay: (e?: MouseEvent<Element, globalThis.MouseEvent>) => void
    onClick: MouseEventHandler<Element>
    referenceProps: ReferenceProps
    isOpen: boolean
  }) => JSX.Element
  manualMenuController?: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  panel: (closeMenu: () => void) => React.ReactNode
  showOnHover?: boolean
  alignment?: Alignment
  allowedPlacements?: Placement[]
  useClickPointAsAnchor?: boolean
  mainAxisOffset?: number
}

export default function FloatingWrapper({
  children,
  panel,
  manualMenuController,
  alignment,
  showOnHover,
  allowedPlacements,
  useClickPointAsAnchor,
  mainAxisOffset = 0,
}: FloatingWrapperProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const open = manualMenuController?.open ?? openMenu
  const onOpenChange = manualMenuController?.onOpenChange ?? setOpenMenu

  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange,
    middleware: [
      offset({ mainAxis: mainAxisOffset }),
      autoPlacement({
        crossAxis: true,
        alignment,
        allowedPlacements,
      }),
    ],
  })

  const clientClickX = useRef<number | undefined>(undefined)
  const clientClickY = useRef<number | undefined>(undefined)
  const clientPoint = useClientPoint(context, {
    x: clientClickX.current,
    y: clientClickY.current,
    enabled: !!useClickPointAsAnchor,
  })

  const hover = useHover(context, {
    handleClose: safePolygon(),
    enabled: !isTouchDevice() && !!showOnHover,
    delay: HOVER_MENU_DELAY_OPT,
  })
  const dismiss = useDismiss(context, {
    bubbles: false,
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
    hover,
  ])
  const { isMounted } = useTransitionStyles(context, {
    duration: 100,
  })

  const toggleDisplay = (e?: MouseEvent<Element, globalThis.MouseEvent>) => {
    if (!open && e && useClickPointAsAnchor) {
      clientClickX.current = e.clientX
      clientClickY.current = e.clientY
    }
    onOpenChange(!open)
  }

  const closeMenu = () => onOpenChange(false)
  const onClick: MouseEventHandler<Element> = (e) => {
    if (isTouchDevice()) toggleDisplay(e)
    else closeMenu()
  }

  return (
    <>
      {children({
        toggleDisplay,
        isOpen: open,
        onClick,
        referenceProps: getReferenceProps({
          ref: refs.setReference,
          onClick,
        }),
      })}
      {isMounted && (
        <FloatingPortal>
          <Transition
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              backfaceVisibility: 'hidden',
            }}
            {...getFloatingProps()}
            appear
            show={open}
            className='z-30 transition-opacity'
            enter='ease-out duration-150'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            {panel(closeMenu)}
          </Transition>
        </FloatingPortal>
      )}
    </>
  )
}
