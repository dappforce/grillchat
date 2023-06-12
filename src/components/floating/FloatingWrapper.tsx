import { isTouchDevice } from '@/utils/device'
import {
  Alignment,
  autoPlacement,
  offset,
  Placement,
  useClientPoint,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'
import { Transition } from '@headlessui/react'
import { MouseEvent, MouseEventHandler, useRef, useState } from 'react'

type ReferenceProps = Record<string, unknown>
export type FloatingWrapperProps = {
  children: (config?: {
    toggleDisplay: (e?: MouseEvent<Element, globalThis.MouseEvent>) => void
    referenceProps: ReferenceProps
  }) => JSX.Element
  panel: (closeMenu: () => void) => React.ReactNode
  alignment?: Alignment
  allowedPlacements?: Placement[]
  useClickPointAsAnchor?: boolean
  yOffset?: number
}

export default function FloatingWrapper({
  children,
  panel,
  alignment,
  allowedPlacements,
  useClickPointAsAnchor,
  yOffset = 0,
}: FloatingWrapperProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    open: openMenu,
    onOpenChange: setOpenMenu,
    middleware: [
      offset({ mainAxis: yOffset }),
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

  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
  ])

  const toggleDisplay = (e?: MouseEvent<Element, globalThis.MouseEvent>) => {
    if (!openMenu && e && useClickPointAsAnchor) {
      clientClickX.current = e.clientX
      clientClickY.current = e.clientY
    }
    setOpenMenu((prev) => !prev)
  }

  const closeMenu = () => setOpenMenu(false)
  const onReferenceClick: MouseEventHandler<Element> = (e) => {
    if (isTouchDevice()) toggleDisplay(e)
    else closeMenu()
  }

  return (
    <>
      {children({
        toggleDisplay,
        referenceProps: getReferenceProps({
          ref: refs.setReference,
          ...getReferenceProps(),
          onClick: onReferenceClick,
        }),
      })}
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
    </>
  )
}
