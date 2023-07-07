import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { cx } from '@/utils/class-names'
import { ComponentProps, ReactNode } from 'react'
import Button from './Button'
import DotBlinkingNotification from './DotBlinkingNotification'

type ExtendedMenu = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: ReactNode
  isComingSoon?: boolean
  onClick?: () => void
  firstVisitNotificationStorageName?: string
}
export type ExtendedMenuListProps = ComponentProps<'div'> & {
  menus: ExtendedMenu[]
}

export default function ExtendedMenuList({
  menus,
  ...props
}: ExtendedMenuListProps) {
  return (
    <div {...props} className={cx('flex flex-col gap-3', props.className)}>
      {menus.map((menu, idx) => {
        const isLastChild = idx === menus.length - 1
        return (
          <ExtendedMenuItem key={idx} menu={menu} isLastChild={isLastChild} />
        )
      })}
    </div>
  )
}

function ExtendedMenuItem({
  menu,
  isLastChild,
}: {
  menu: ExtendedMenu
  isLastChild: boolean
}) {
  const {
    description,
    icon: Icon,
    title,
    isComingSoon,
    onClick,
    firstVisitNotificationStorageName,
  } = menu

  const { closeNotification, showNotification } = useFirstVisitNotification(
    firstVisitNotificationStorageName ?? ''
  )

  const showBlinking = firstVisitNotificationStorageName && showNotification

  return (
    <Button
      variant='transparent'
      interactive='none'
      size='noPadding'
      disabled={isComingSoon}
      onClick={() => {
        firstVisitNotificationStorageName && closeNotification()
        onClick?.()
      }}
      className='flex cursor-pointer items-center gap-2 rounded-none'
      disabledStyle='subtle'
    >
      <div
        className={cx(
          'flex flex-shrink-0 items-center justify-center rounded-full bg-background-lighter p-3 text-text-muted',
          !isLastChild && 'mb-3'
        )}
      >
        <Icon className='text-2xl' />
      </div>
      <div
        className={cx(
          'flex flex-1 flex-col items-start',
          !isLastChild && 'border-b border-border-gray pb-3'
        )}
      >
        <span className='flex items-center gap-2'>
          {title}{' '}
          {isComingSoon && (
            <span className='rounded-full bg-background-lighter px-2 py-0.5 text-xs'>
              Soon
            </span>
          )}
          {showBlinking && <DotBlinkingNotification />}
        </span>
        <span className='text-sm text-text-muted'>{description}</span>
      </div>
    </Button>
  )
}
