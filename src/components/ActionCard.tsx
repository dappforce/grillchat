import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import Button, { ButtonProps } from './Button'
import DotBlinkingNotification from './DotBlinkingNotification'

type Action = {
  text: string
  description?: string
  icon: (props: { className?: string }) => JSX.Element
  iconClassName?: string
  className?: string
  onClick?: ButtonProps['onClick']
  disabled?: boolean
  isComingSoon?: boolean
  firstVisitNotificationStorageName?: string
}

export type ActionCardProps = ComponentProps<'div'> & {
  actions: Action[]
}

export default function ActionCard({ actions, ...props }: ActionCardProps) {
  if (actions.length === 0) return null

  return (
    <div
      {...props}
      className={cx(
        'w-full overflow-hidden rounded-2xl bg-background-lighter',
        props.className
      )}
    >
      {actions.map((action) => (
        <ActionItem key={action.text} action={action} />
      ))}
    </div>
  )
}

function ActionItem({ action }: { action: Action }) {
  const {
    icon: Icon,
    text,
    className,
    description,
    disabled,
    iconClassName,
    isComingSoon,
    onClick,
    firstVisitNotificationStorageName,
  } = action

  const { closeNotification, showNotification } = useFirstVisitNotification(
    firstVisitNotificationStorageName ?? ''
  )

  const showBlinking = firstVisitNotificationStorageName && showNotification

  return (
    <Button
      disabled={disabled || isComingSoon}
      variant='transparent'
      interactive='none'
      size='noPadding'
      key={text}
      className={cx(
        'flex w-full items-center gap-3 rounded-none border-b border-background-lightest p-4 last:border-none',
        'transition hover:bg-background-lightest focus-visible:bg-background-lightest',
        className
      )}
      onClick={(e) => {
        firstVisitNotificationStorageName && closeNotification()
        onClick?.(e as any)
      }}
      disabledStyle='subtle'
    >
      <Icon
        className={cx('text-xl', description && 'text-2xl', iconClassName)}
      />
      <div className='flex flex-col items-start'>
        <span className='flex items-center gap-2'>
          {text}{' '}
          {isComingSoon && (
            <span className='rounded-full bg-background-lightest px-2 py-0.5 text-xs'>
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
