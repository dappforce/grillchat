import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { LuShield } from 'react-icons/lu'
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
  const myAddress = useMyAccount((state) => state.address)
  const { data: chat } = getPostQuery.useQuery(chatId)
  const isOwner = chat?.struct.ownerId === myAddress
  if (!isOwner) {
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
          <LuShield
            className={cx(
              'relative -top-px text-sm text-text-muted',
              props.className
            )}
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
