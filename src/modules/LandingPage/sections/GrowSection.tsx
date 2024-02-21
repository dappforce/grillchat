import LikesImage from '@/assets/graphics/landing/likes.png'
import PinkHeartImage from '@/assets/graphics/landing/pink-heart.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import HighlightedText from '../common/HighlightedText'

export default function GrowSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <div className='absolute right-28 top-0 h-[731px] w-[731px] -translate-y-1/2 translate-x-full rounded-full bg-[#48AEF861] blur-[478px]' />
      <div className='flex flex-col gap-10'>
        <h3 className='relative text-center text-5xl font-bold leading-none'>
          <HighlightedText size='sm' rotate={3}>
            Grow
          </HighlightedText>
          <span className='relative z-10'>
            {' '}
            Your Community Through The Grill.So Audience &{' '}
          </span>
          <HighlightedText size='sm' rotate={3}>
            Monetize
          </HighlightedText>
          <span className='relative z-10'> Existing Ones</span>
        </h3>
        <div className='grid grid-cols-2 gap-7'>
          <div className='flex items-center gap-3'>
            <Image src={PinkHeartImage} alt='' className='w-36 flex-shrink-0' />
            <span className='text-2xl text-[#FEEFFB]'>
              You start earning from the first post and the first like
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Image src={LikesImage} alt='' className='w-36 flex-shrink-0' />
            <span className='text-2xl text-[#FEEFFB]'>
              You don’t need thousands of subscribers or 5 million views
            </span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-7'>
          <div className='flex flex-col rounded-3xl bg-white/10 p-5'>
            <span className='mb-2.5 text-2xl text-[#FEEFFB]'>
              Likes during the last month
            </span>
            <span className='mb-1.5 text-5xl font-bold'>149,867</span>
            <span className='text-xl text-white/70'>194,379 all time</span>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/10 p-5'>
            <span className='mb-2.5 text-2xl text-[#FEEFFB]'>
              Comments created during the last month
            </span>
            <span className='mb-1.5 text-5xl font-bold'>10,627</span>
            <span className='text-xl text-white/70'>22,691 all time</span>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <span className='text-3xl font-bold'>
            The easiest way in the market to monetize your blogging is on Grill
          </span>
          <span className='text-2xl text-[#FEEFFB]'>
            Other social media do not give effective monetization of your
            audience’s engagement, but we do! Invite them to interact with your
            content on Grill.so, and get rewards for each like!
          </span>
        </div>
      </div>
    </section>
  )
}
