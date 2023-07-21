import { isTouchDevice } from '@/utils/device'
import {
  Alignment,
  autoPlacement,
  FloatingPortal,
  offset,
  Placement,
  safePolygon,
  useClientPoint,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
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
  alignment,
  showOnHover,
  allowedPlacements,
  useClickPointAsAnchor,
  mainAxisOffset = 0,
}: FloatingWrapperProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    open: openMenu,
    onOpenChange: setOpenMenu,
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
  })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
    hover,
  ])

  const toggleDisplay = (e?: MouseEvent<Element, globalThis.MouseEvent>) => {
    if (!openMenu && e && useClickPointAsAnchor) {
      clientClickX.current = e.clientX
      clientClickY.current = e.clientY
    }
    setOpenMenu((prev) => !prev)
  }

  const closeMenu = () => setOpenMenu(false)
  const onClick: MouseEventHandler<Element> = (e) => {
    if (isTouchDevice()) toggleDisplay(e)
    else closeMenu()
  }

  return (
    <>
      {children({
        toggleDisplay,
        isOpen: openMenu,
        onClick,
        referenceProps: getReferenceProps({
          ref: refs.setReference,
          onClick,
        }),
      })}
      <FloatingPortal>
        <Transition
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          {...getFloatingProps()}
          appear
          show={openMenu}
          className='z-30 transition-opacity'
          enter='ease-out duration-150'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          {panel(closeMenu)}
        </Transition>
      </FloatingPortal>
    </>
  )
}
