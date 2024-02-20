import One from '@/assets/graphics/landing/1.svg'
import Two from '@/assets/graphics/landing/2.svg'
import Three from '@/assets/graphics/landing/3.svg'
import Four from '@/assets/graphics/landing/4.svg'
import Diamond from '@/assets/graphics/landing/diamond.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function HowItWorksSection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <div className='absolute -top-20 left-0 h-[731px] w-[731px] -translate-x-1/2 bg-[#4F46E5C4] blur-[478px]' />
      <Image
        src={Diamond}
        alt=''
        className='absolute -left-10 top-0 h-32 w-32 -translate-x-full rotate-[30deg] opacity-40 blur-[2px]'
      />
      <div className='relative flex flex-col gap-10'>
        <h3 className='text-center text-5xl font-bold'>How Does It Work?</h3>
        <div className='grid grid-cols-4 gap-5'>
          <div className='rounded-3xl bg-white/10 p-6 pb-8 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <One className='text-[100px]' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              Every user who stakes at least 2000 SUB can like posts and
              comments
            </p>
          </div>
          <div className='rounded-3xl bg-white/10 p-6 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <Two className='text-[100px]' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              When you like someone’s content, you earn extra rewards in SUB
              tokens
            </p>
          </div>
          <div className='rounded-3xl bg-white/10 p-6 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <Three className='text-[100px]' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              When someone likes your post or comment, you receive a reward
            </p>
          </div>
          <div className='rounded-3xl bg-white/10 p-6 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <Four className='text-[100px]' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              When someone likes a comment under your post, you and the
              comment’s author both receive a reward in the ratio of 30% to 70%
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
