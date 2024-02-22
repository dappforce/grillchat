import Diamond from '@/assets/graphics/landing/diamond.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import Heading from '../common/Heading'

export default function VideoSection(props: ComponentProps<'section'>) {
  return (
    <section {...props} className={cx('relative', props.className)}>
      <Image
        src={Diamond}
        alt=''
        className='unselectable absolute -bottom-2 -left-1 h-28 w-28 translate-y-3/4 rotate-[-33deg] opacity-60 blur-[2px] md:h-40 md:w-40 lg:-left-16 lg:top-64 lg:h-44 lg:w-44 lg:translate-y-0 lg:rotate-[18deg] xl:h-56 xl:w-56'
      />
      <div className={cx('relative mx-auto max-w-6xl')}>
        <div className='absolute -bottom-12 right-0 h-[731px] w-[731px] translate-x-3/4 translate-y-1/2 rounded-full bg-[#D034E9A6] blur-[478px]' />
        <div className='absolute -top-20 left-0 h-[731px] w-[731px] -translate-x-1/2 bg-[#4F46E5C4] blur-[478px]' />
        <div className='relative flex flex-col items-center text-center'>
          <Heading className='mb-4'>How To Start Earning?</Heading>
          <span className='mb-6 text-lg text-[#FEEFFB] sm:text-xl md:mb-10'>
            Watch the short video guide
          </span>
          <div className='flex aspect-video w-full max-w-2xl items-center justify-center rounded-3xl bg-white/10'>
            <Heading as='span'>Demo Video</Heading>
          </div>
        </div>
      </div>
    </section>
  )
}
