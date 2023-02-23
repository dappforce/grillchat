import { cx } from '@/utils/className'
import Image from 'next/image'
import { ComponentProps, forwardRef } from 'react'

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar({ address, ...props }: AddressAvatarProps, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          'relative h-9 w-9 overflow-hidden rounded-full bg-background-lighter',
          props.className
        )}
      >
        <Image fill src={`https://robohash.org/${address}.png`} alt='avatar' />
      </div>
    )
  }
)
export default AddressAvatar
