import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import Button, { ButtonProps } from './Button'

type Action = {
  text: string
  description?: string
  icon: (props: { className?: string }) => JSX.Element
  iconClassName?: string
  className?: string
  onClick?: ButtonProps['onClick']
  disabled?: boolean
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
      {actions.map(
        ({
          icon: Icon,
          iconClassName,
          text,
          description,
          className,
          onClick,
          disabled,
        }) => (
          <Button
            disabled={disabled}
            variant='transparent'
            interactive='none'
            size='noPadding'
            key={text}
            className={cx(
              'flex w-full items-center gap-3 rounded-none border-b border-background-lightest p-4 last:border-none',
              'transition hover:bg-background-lightest focus-visible:bg-background-lightest',
              className
            )}
            onClick={onClick}
            disabledStyle='subtle'
          >
            <Icon
              className={cx(
                'text-xl',
                description && 'text-2xl',
                iconClassName
              )}
            />
            <div className='flex flex-col items-start'>
              <span>{text}</span>
              <span className='text-sm text-text-muted'>{description}</span>
            </div>
          </Button>
        )
      )}
    </div>
  )
}
