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
      <div className='absolute right-0 top-1/2 h-[731px] w-[731px] -translate-y-1/2 translate-x-3/4 rounded-full bg-[#D034E9A6] blur-[350px]' />
      <div className='relative w-full overflow-clip rounded-3xl bg-gradient-to-r from-[#3F3CD5] to-[#343292] py-12 text-center'>
        <Image
          src={CoinsImage}
          alt=''
          className='absolute -left-12 top-0 h-[calc(100%_+_50px)] w-auto'
        />
        <span className='absolute right-0 top-1/2 -translate-y-1/2 rotate-[-20deg] text-[200px] font-bold text-white/20'>
          4x
        </span>
        <div className='mx-auto flex max-w-xl flex-col items-center gap-6'>
          <span className='text-2xl font-medium'>
            Join today and get up to 4x more rewards
            <br />
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
