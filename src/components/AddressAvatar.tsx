import Image from 'next/image'
import { ComponentProps } from 'react'

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
}

export default function AddressAvatar({ address }: AddressAvatarProps) {
  return (
    <div className='relative h-9 w-9 overflow-hidden rounded-full bg-background-lighter'>
      <Image fill src={`https://robohash.org/${address}.png`} alt='avatar' />
    </div>
  )
}
