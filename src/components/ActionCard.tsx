import useFirstVisitNotification from '@/hooks/useFirstVisitNotification'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import Button, { ButtonProps } from './Button'
import Card from './Card'
import DotBlinkingNotification from './DotBlinkingNotification'
import CustomLink from './referral/CustomLink'

type Action = {
  text: string
  description?: string
  icon: (props: { className?: string }) => JSX.Element
  iconClassName?: string
  className?: string
  href?: string
  openInNewTab?: boolean
  onClick?: ButtonProps['onClick']
  disabled?: boolean
  isComingSoon?: boolean
  firstVisitNotificationStorageName?: string
}

export type ActionCardProps = ComponentProps<'div'> & {
  actions: Action[]
  size?: 'md' | 'sm'
  actionClassName?: string
}

/**
 * A card that displays a list of actions.
 *
 * **Note**: This component's default background are not compatible if you use light theme and place this component inside `--background` colored component.
 * Either put this component inside `--background-lighter` colored component or change the background of this component instead.
 */
export default function ActionCard({
  actions,
  size = 'md',
  actionClassName,
  ...props
}: ActionCardProps) {
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
        <ActionItem size={size} key={action.text} action={action} />
      ))}
    </div>
  )
}

type ActionItemProps = {
  action: Action
  size?: ActionCardProps['size']
}
function ActionItem({ action, size }: ActionItemProps) {
  const {
    icon: Icon,
    text,
    href,
    openInNewTab,
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

  const containerClassName = cx(
    'w-full rounded-none block border-b border-background-lightest p-4 text-left last:border-none',
    'transition hover:bg-background-lightest focus-visible:bg-background-lightest',
    size === 'md' ? 'p-4' : 'px-4 py-3',
    className
  )

  const content = (
    <span className='flex w-full items-center gap-3 text-left'>
      <Icon
        className={cx(
          'flex-shrink-0 text-xl',
          description && 'mx-1 text-2xl',
          iconClassName
        )}
      />
      <div className='flex flex-1 flex-col'>
        <span className='flex items-center gap-2'>
          {text}{' '}
          {isComingSoon && (
            <Card size='sm' className='bg-background-lightest'>
              Soon
            </Card>
          )}
          {showBlinking && <DotBlinkingNotification />}
          {openInNewTab && (
            <FaArrowUpRightFromSquare className='ml-auto text-[0.875em] text-text-muted' />
          )}
        </span>
        <span className='text-sm text-text-muted'>{description}</span>
      </div>
    </span>
  )

  if (href && !disabled) {
    let anchorProps = {}
    if (openInNewTab) {
      anchorProps = {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    }
    return (
      <CustomLink {...anchorProps} className={containerClassName} href={href}>
        {content}
      </CustomLink>
    )
  }

  return (
    <Button
      disabled={disabled || isComingSoon}
      variant='transparent'
      interactive='none'
      size='noPadding'
      key={text}
      className={containerClassName}
      onClick={(e) => {
        firstVisitNotificationStorageName && closeNotification()
        onClick?.(e as any)
      }}
      disabledStyle='subtle'
    >
      {content}
    </Button>
  )
}
