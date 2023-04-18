import { isTouchDevice } from '@/utils/device'
import {
  autoPlacement,
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
  children: (
    toggleMenu: () => void,
    onContextMenu: MouseEventHandler<Element>,
    referenceProps: ReferenceProps
  ) => React.ReactNode
  menuPanel: (closeMenu: () => void) => React.ReactNode
  allowedPlacements?: Placement[]
}

export default function CustomContextMenu({
  children,
  menuPanel,
  allowedPlacements,
}: CustomContextMenuProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    open: openMenu,
    onOpenChange: setOpenMenu,
    middleware: [
      autoPlacement({
        crossAxis: true,
        alignment: 'end',
        allowedPlacements,
      }),
    ],
  })

  const [clientClickX, setClientClickX] = useState(0)
  const [clientClickY, setClientClickY] = useState(0)
  const clientPoint = useClientPoint(context, {
    x: clientClickX,
    y: clientClickY,
  })

  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
  ])

  const toggleMenu = (e?: MouseEvent<Element, globalThis.MouseEvent>) => {
    if (!openMenu && e) {
      setClientClickX(e.clientX)
      setClientClickY(e.clientY)
    }
    setOpenMenu((prev) => !prev)
  }

  const onContextMenu: MouseEventHandler<Element> = (e) => {
    if (window.getSelection()?.type !== 'Range') {
      e.preventDefault()
      toggleMenu(e)
    }
  }

  const closeMenu = () => setOpenMenu(false)
  const onReferenceClick: MouseEventHandler<Element> = (e) => {
    if (isTouchDevice()) toggleMenu(e)
    else closeMenu()
  }

  return (
    <>
      {children(
        toggleMenu,
        onContextMenu,
        getReferenceProps({
          ref: refs.setReference,
          ...getReferenceProps(),
          onClick: onReferenceClick,
        })
      )}
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
        className='z-50 transition-opacity'
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
