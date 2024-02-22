import CoinsImage from '@/assets/graphics/landing/coins.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function JoinSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <div className='relative w-full overflow-clip rounded-3xl bg-gradient-to-r from-[#3F3CD5] to-[#343292] p-6 text-center sm:p-8 lg:py-12'>
        <Image
          src={CoinsImage}
          alt=''
          className='absolute -bottom-10 -left-8 h-3/4 w-auto sm:-left-12 sm:h-full lg:-left-12 lg:bottom-auto lg:top-0 lg:h-[calc(100%_+_50px)]'
        />
        <span className='absolute -bottom-6 -right-4 rotate-[-20deg] text-[100px] font-bold text-white/20 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:text-[150px] lg:right-0 lg:text-[200px]'>
          4x
        </span>
        <div className='mx-auto flex max-w-xl flex-col items-center gap-6'>
          <span className='text-xl font-medium md:text-2xl'>
            Join today and get up to 4x more rewards{' '}
            <br className='hidden sm:inline' />
            from every like and post you do
          </span>
          <Button className='bg-white text-[#3C39C0]' size='xl' roundings='xl'>
            Start Earning
          </Button>
        </div>
      </div>
    </section>
  )
}
