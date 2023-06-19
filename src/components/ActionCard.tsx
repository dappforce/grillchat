import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import Button, { ButtonProps } from './Button'

type Action = {
  text: string
  icon: (props: { className?: string }) => JSX.Element
  iconClassName?: string
  className?: string
  onClick: ButtonProps['onClick']
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
        ({ icon: Icon, iconClassName, text, className, onClick, disabled }) => (
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
          >
            <Icon className={cx('text-xl', iconClassName)} />
            <span>{text}</span>
          </Button>
        )
      )}
    </div>
  )
}
