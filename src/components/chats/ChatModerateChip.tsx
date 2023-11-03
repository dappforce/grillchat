import useIsOwnerOfPost from '@/hooks/useIsOwnerOfPost'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { LuShield } from 'react-icons/lu'
import PopOver, { PopOverProps } from '../floating/PopOver'

export type ChatModerateChipProps = ComponentProps<'div'> & {
  chatId: string
  address?: string
  popOverProps?: Omit<PopOverProps, 'trigger' | 'children'>
}

export default function ChatModerateChip({
  chatId,
  address,
  popOverProps,
  ...props
}: ChatModerateChipProps) {
  const myAddress = useMyMainAddress()
  const usedAddress = address ?? myAddress ?? ''
  const isOwner = useIsOwnerOfPost(chatId, usedAddress)
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
          <LuShield className={cx('text-sm text-text-muted')} />
        </div>
      }
      panelSize='sm'
      triggerOnHover
      yOffset={10}
      {...popOverProps}
    >
      <p>
        {myAddress === address ? 'You can moderate this chat' : 'Moderator'}
      </p>
    </PopOver>
  )
}
