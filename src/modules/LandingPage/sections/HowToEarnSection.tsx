import ArrowRight from '@/assets/graphics/landing/arrow-right.svg'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export default function HowToEarnSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <div className='flex flex-col items-center'>
        <h3 className='mb-10 text-center text-5xl font-bold'>
          How to earn tokens on the platform
        </h3>
        <div className='flex gap-10'>
          <div className='flex flex-shrink-0 items-center justify-center rounded-3xl bg-white/10 px-6 py-8 text-[98px]'>
            <span className='flex-shrink-0'>👍</span>
            <ArrowRight className='w-16 flex-shrink-0' />
            <span className='flex-shrink-0'>💰</span>
          </div>
          <div className='flex flex-col gap-4 py-12 text-2xl font-medium text-[#FEEFFB]'>
            <span className='text-3xl font-bold'>Earn on:</span>
            <div className='grid grid-cols-[max-content_1fr] gap-x-2 gap-y-4'>
              <span>💰</span>
              <span>Every like on your post</span>
              <span>💰</span>
              <span>Every like on your comment</span>
              <span>💰</span>
              <span>When you like posts and comments of other creators</span>
              <span>💰</span>
              <span>
                When comments under your post receive likes - you receive a
                percentage of the reward for that like
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
