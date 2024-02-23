import ArrowRight from '@/assets/graphics/landing/arrow-right.svg'
import MoneyImage from '@/assets/graphics/landing/moneybag.png'
import ThumbsUpImage from '@/assets/graphics/landing/thumbsup.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import Heading from '../common/Heading'

export default function HowToEarnSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <div className='flex flex-col items-center'>
        <Heading withMargin>How To Earn Tokens On The Platform</Heading>
        <div className='flex flex-col gap-6 md:flex-row md:gap-10'>
          <div className='flex flex-shrink-0 items-center justify-around gap-2 rounded-3xl bg-white/5 px-6 py-8 sm:justify-center sm:gap-16 md:gap-2'>
            <Image
              src={ThumbsUpImage}
              alt=''
              className='mx-4 w-20 flex-shrink-0'
            />
            <ArrowRight className='w-12 flex-shrink-0 sm:w-16' />
            <Image src={MoneyImage} alt='' className='w-24 flex-shrink-0' />
          </div>
          <div className='flex flex-col gap-4 font-medium text-[#FEEFFB] md:py-12'>
            <span className='text-2xl font-bold sm:text-3xl'>Earn on:</span>
            <div className='grid grid-cols-[max-content_1fr] gap-x-2 gap-y-4 text-xl sm:text-2xl'>
              <Image src={MoneyImage} alt='' className='w-7 flex-shrink-0' />
              <span>Every like on your post</span>
              <Image src={MoneyImage} alt='' className='w-7 flex-shrink-0' />
              <span>Every like on your comment</span>
              <Image src={MoneyImage} alt='' className='w-7 flex-shrink-0' />
              <span>When you like posts and comments of other creators</span>
              <Image src={MoneyImage} alt='' className='w-7 flex-shrink-0' />
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
