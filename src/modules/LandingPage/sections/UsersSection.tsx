import Blogger from '@/assets/graphics/landing/bloggers.png'
import CryptoEnthusiast from '@/assets/graphics/landing/crypto-enthusiasts.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export type UsersSectionProps = ComponentProps<'section'>

export default function UsersSection({ ...props }: UsersSectionProps) {
  return (
    <section
      {...props}
      className={cx(
        'relative mx-auto grid max-w-4xl grid-cols-2 justify-center gap-20',
        props.className
      )}
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-6 h-36'>
          <Image className='max-h-full w-auto' src={Blogger} alt='' />
        </div>
        <div className='relative mb-4 px-4 py-1 text-3xl font-bold'>
          <div className='absolute inset-0 h-full w-full -rotate-1 rounded-2xl bg-[#02AE48]' />
          <span className='relative'>For bloggers</span>
        </div>
        <p className='text-2xl font-medium text-[#FEEFFB]'>
          When your followers like or comment on your posts, you earn daily
          token rewards
        </p>
      </div>
      <div className='flex flex-col items-center text-center'>
        <div className='mb-6 h-36'>
          <Image className='max-h-full w-auto' src={CryptoEnthusiast} alt='' />
        </div>
        <div className='relative mb-4 px-4 py-1 text-3xl font-bold'>
          <div className='absolute inset-0 h-full w-full -rotate-1 rounded-2xl bg-[#02AE48]' />
          <span className='relative'>For crypto enthusiasts</span>
        </div>
        <p className='text-2xl font-medium text-[#FEEFFB]'>
          Comment and like every day! Every action you make is monetized
        </p>
      </div>
    </section>
  )
}
