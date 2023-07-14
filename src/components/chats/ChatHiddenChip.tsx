import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import PopOver, { PopOverProps } from '../floating/PopOver'

export type ChatHiddenChipProps = ComponentProps<'div'> & {
  popOverProps?: Omit<PopOverProps, 'trigger' | 'children'>
}

export default function ChatHiddenChip({
  popOverProps,
  ...props
}: ChatHiddenChipProps) {
  return (
    <PopOver
      triggerOnHover
      panelSize='sm'
      placement='top-end'
      yOffset={8}
      {...popOverProps}
      trigger={
        <div
          {...props}
          className={cx(
            'flex items-center gap-2 rounded-full bg-orange-500/10 px-2 py-1 text-orange-500',
            props.className
          )}
        >
          <HiOutlineEyeSlash />
          <span className='text-xs'>Hidden</span>
        </div>
      }
    >
      <p>Only you can see this group chat.</p>
      <p>Other people will not see it on Grill.</p>
    </PopOver>
  )
}
