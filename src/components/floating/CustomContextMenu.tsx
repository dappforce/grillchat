import {
  autoPlacement,
  useClientPoint,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'
import { Transition } from '@headlessui/react'
import { SyntheticEvent, useState } from 'react'

type ReferenceProps = Record<string, unknown>
export type CustomContextMenuProps = {
  children: (
    toggleMenu: () => void,
    onContextMenu: (e: SyntheticEvent) => void,
    referenceProps: ReferenceProps
  ) => React.ReactNode
  menuPanel: React.ReactNode
}

export default function CustomContextMenu({
  children,
  menuPanel,
}: CustomContextMenuProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    open: openMenu,
    onOpenChange: setOpenMenu,
    middleware: [autoPlacement()],
  })
  const [enableClientPoint, setEnableClientPoint] = useState(false)
  const clientPoint = useClientPoint(context, {
    enabled: enableClientPoint && !openMenu,
  })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
    dismiss,
  ])

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev)
  }

  const onContextMenu = (e: SyntheticEvent) => {
    if (window.getSelection()?.type !== 'Range') {
      e.preventDefault()
      toggleMenu()
    }
  }

  const onMouseEnter = () => {
    setEnableClientPoint(true)
  }
  const onMouseLeave = () => {
    setEnableClientPoint(false)
  }

  return (
    <>
      {children(
        toggleMenu,
        onContextMenu,
        getReferenceProps({
          ref: refs.setReference,
          ...getReferenceProps(),
          onMouseEnter,
          onMouseLeave,
          onClick: () => setOpenMenu(false),
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
        className='transition-opacity'
        enter='ease-out duration-150'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        {menuPanel}
      </Transition>
    </>
  )
}
