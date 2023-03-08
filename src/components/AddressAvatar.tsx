import { cx } from '@/utils/className'
import * as bottts from '@dicebear/bottts'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import { ComponentProps, forwardRef, useMemo } from 'react'

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar({ address, ...props }: AddressAvatarProps, ref) {
    const avatar = useMemo(() => {
      return createAvatar(bottts, {
        size: 128,
        seed: address,
      }).toDataUriSync()
    }, [address])

    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          'relative h-9 w-9 overflow-hidden rounded-full bg-background-lighter',
          props.className
        )}
      >
        <Image
          sizes='5rem'
          className='relative'
          fill
          src={avatar}
          alt='avatar'
        />
      </div>
    )
  }
)
export default AddressAvatar
