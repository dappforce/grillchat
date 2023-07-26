import ModerateIcon from '@/assets/icons/moderate.svg'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import PopOver, { PopOverProps } from '../floating/PopOver'

export type ChatModerateChipProps = ComponentProps<'div'> & {
  chatId: string
  popOverProps?: Omit<PopOverProps, 'trigger' | 'children'>
}

export default function ChatModerateChip({
  chatId,
  popOverProps,
  ...props
}: ChatModerateChipProps) {
  const { isAuthorized } = useAuthorizedForModeration(chatId)
  if (!isAuthorized) {
    return null
  }

  return (
    <PopOver
      trigger={
        <div
          {...props}
          onClick={(e) => {
            e.stopPropagation()
            props.onClick?.(e)
          }}
        >
          <ModerateIcon
            className={cx('text-xl text-text-muted', props.className)}
          />
        </div>
      }
      panelSize='sm'
      triggerOnHover
      yOffset={10}
      {...popOverProps}
    >
      <p>You can moderate this chat</p>
    </PopOver>
  )
}
