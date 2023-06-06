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
import { MouseEvent, MouseEventHandler, useState } from 'react'

type ReferenceProps = Record<string, unknown>
export type CustomContextMenuProps = {
  children: (config?: {
    toggleMenu: () => void
    onContextMenu: MouseEventHandler<Element>
    referenceProps: ReferenceProps
  }) => JSX.Element
  menuPanel: (closeMenu: () => void) => React.ReactNode
  alignment?: Alignment
  allowedPlacements?: Placement[]
  useClickPointAsAnchor?: boolean
  yOffset?: number
}

export default function CustomContextMenu({
  children,
  menuPanel,
  alignment,
  allowedPlacements,
  useClickPointAsAnchor,
  yOffset = 0,
}: CustomContextMenuProps) {
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

  const [clientClickX, setClientClickX] = useState<number | undefined>()
  const [clientClickY, setClientClickY] = useState<number | undefined>()
  const clientPoint = useClientPoint(context, {
    x: clientClickX,
    y: clientClickY,
    enabled: !!useClickPointAsAnchor,
  })

  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
  ])

  const toggleMenu = (e?: MouseEvent<Element, globalThis.MouseEvent>) => {
    if (!openMenu && e && useClickPointAsAnchor) {
      setClientClickX(e.clientX)
      setClientClickY(e.clientY)
    }
    setOpenMenu((prev) => !prev)
  }

  const onContextMenu: MouseEventHandler<Element> = (e) => {
    e.preventDefault()
    toggleMenu(e)
  }

  const closeMenu = () => setOpenMenu(false)
  const onReferenceClick: MouseEventHandler<Element> = (e) => {
    if (isTouchDevice()) toggleMenu(e)
    else closeMenu()
  }

  return (
    <>
      {children({
        toggleMenu,
        onContextMenu,
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
        {menuPanel(closeMenu)}
      </Transition>
    </>
  )
}
