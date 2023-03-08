import { cx } from '@/utils/className'
import Image from 'next/image'
import { ComponentProps, forwardRef, useState } from 'react'

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar({ address, ...props }: AddressAvatarProps, ref) {
    const [loadedImg, setLoadedImg] = useState(false)

    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          'relative h-9 w-9 overflow-hidden rounded-full',
          loadedImg ? 'bg-background-lighter' : 'bg-background-lighter/15',
          props.className
        )}
      >
        {!loadedImg && (
          <div className='absolute inset-0 z-10 flex h-full w-full animate-pulse items-center justify-center bg-background-lighter' />
        )}
        <Image
          sizes='5rem'
          className='relative'
          fill
          onLoad={() => setLoadedImg(true)}
          src={`https://robohash.org/${address}.png`}
          alt='avatar'
        />
      </div>
    )
  }
)
export default AddressAvatar
