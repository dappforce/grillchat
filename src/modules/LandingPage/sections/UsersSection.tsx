import Blogger from '@/assets/graphics/landing/bloggers.png'
import CryptoEnthusiast from '@/assets/graphics/landing/crypto-enthusiasts.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import HighlightedText from '../common/HighlightedText'

export type UsersSectionProps = ComponentProps<'section'>

export default function UsersSection({ ...props }: UsersSectionProps) {
  return (
    <section
      {...props}
      className={cx(
        'relative mx-auto grid max-w-lg grid-cols-1 justify-center gap-20 sm:max-w-xl md:max-w-4xl md:grid-cols-2',
        props.className
      )}
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-6 h-36'>
          <Image className='max-h-full w-auto' src={Blogger} alt='' />
        </div>
        <HighlightedText className='mb-4 text-2xl font-bold md:text-3xl'>
          For bloggers
        </HighlightedText>
        <p className='text-balance text-lg text-[#FEEFFB] sm:text-xl md:text-2xl md:font-medium'>
          When your followers like or comment on your posts, you earn daily
          token rewards
        </p>
      </div>
      <div className='flex flex-col items-center text-center'>
        <div className='mb-6 h-36'>
          <Image className='max-h-full w-auto' src={CryptoEnthusiast} alt='' />
        </div>
        <HighlightedText className='mb-4 text-2xl font-bold md:text-3xl'>
          For crypto enthusiasts
        </HighlightedText>
        <p className='text-balance text-lg text-[#FEEFFB] sm:text-xl md:text-2xl md:font-medium'>
          Comment and like every day! Every action you make is monetized
        </p>
      </div>
    </section>
  )
}
