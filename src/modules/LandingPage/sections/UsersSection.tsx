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
        'relative mx-auto grid max-w-4xl grid-cols-2 justify-center gap-20',
        props.className
      )}
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-6 h-36'>
          <Image className='max-h-full w-auto' src={Blogger} alt='' />
        </div>
        <HighlightedText className='mb-4 text-3xl font-bold'>
          For bloggers
        </HighlightedText>
        <p className='text-2xl font-medium text-[#FEEFFB]'>
          When your followers like or comment on your posts, you earn daily
          token rewards
        </p>
      </div>
      <div className='flex flex-col items-center text-center'>
        <div className='mb-6 h-36'>
          <Image className='max-h-full w-auto' src={CryptoEnthusiast} alt='' />
        </div>
        <HighlightedText className='mb-4 text-3xl font-bold'>
          For crypto enthusiasts
        </HighlightedText>
        <p className='text-2xl font-medium text-[#FEEFFB]'>
          Comment and like every day! Every action you make is monetized
        </p>
      </div>
    </section>
  )
}
