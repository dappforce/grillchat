import Diamond from '@/assets/graphics/landing/diamond.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function VideoSection(props: ComponentProps<'section'>) {
  return (
    <section {...props} className={cx('relative', props.className)}>
      <Image
        src={Diamond}
        alt=''
        className='absolute -left-16 top-64 h-56 w-56 rotate-[18deg] opacity-60 blur-[2px]'
      />
      <div className={cx('relative mx-auto max-w-6xl')}>
        <div className='absolute -top-20 left-0 h-[731px] w-[731px] -translate-x-1/2 bg-[#4F46E5C4] blur-[478px]' />
        <div className='relative flex flex-col items-center text-center'>
          <h3 className='mb-4 text-5xl font-bold'>How To Start Earning?</h3>
          <span className='mb-10 text-xl text-[#FEEFFB]'>
            Watch the short video guide
          </span>
          <div className='flex aspect-video w-full max-w-2xl items-center justify-center rounded-3xl bg-white/10'>
            <span className='text-5xl font-bold'>Demo Video</span>
          </div>
        </div>
      </div>
    </section>
  )
}
