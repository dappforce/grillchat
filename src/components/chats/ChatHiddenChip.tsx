import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import PopOver from '../floating/PopOver'

export type ChatHiddenChipProps = ComponentProps<'div'>

export default function ChatHiddenChip({ ...props }: ChatHiddenChipProps) {
  return (
    <PopOver
      triggerOnHover
      panelSize='sm'
      placement='top'
      yOffset={8}
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
      <p>Connect an EVM wallet to unlock more features</p>
    </PopOver>
  )
}
