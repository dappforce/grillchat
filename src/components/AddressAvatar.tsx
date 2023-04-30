import useRandomColor from '@/hooks/useRandomColor'
import { cx } from '@/utils/class-names'
import * as bottts from '@dicebear/bottts'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import { ComponentProps, forwardRef, useMemo } from 'react'

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
  avatar?: string
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar(
    { address, avatar, ...props }: AddressAvatarProps,
    ref
  ) {
    const backgroundColor = useRandomColor(address, 'dark')
    const randomAvatar = useMemo(() => {
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
          'relative h-9 w-9 overflow-hidden rounded-full bg-background-lightest',
          props.className
        )}
        style={{ backgroundColor }}
      >
        <div className='relative h-full w-full p-0'>
          <div className='relative h-full w-full'>
            <Image
              sizes='5rem'
              className='relative rounded-full'
              fill
              src={avatar ?? randomAvatar}
              alt='avatar'
            />
          </div>
        </div>
      </div>
    )
  }
)
export default AddressAvatar
