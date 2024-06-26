import LikesImage from '@/assets/graphics/landing/likes.png'
import PinkHeartImage from '@/assets/graphics/landing/pink-heart.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import BgGradient from '../common/BgGradient'
import Heading from '../common/Heading'
import HighlightedText from '../common/HighlightedText'

export default function GrowSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <BgGradient
        color='blue'
        className='absolute right-52 top-1/2 h-[731px] w-[731px] -translate-y-1/2 translate-x-full lg:right-28'
      />
      <div className='relative flex flex-col'>
        <Heading className='relative' withMargin>
          <HighlightedText size='sm' rotate={3}>
            Grow
          </HighlightedText>
          <span className='relative z-10'>
            {' '}
            Your Community Through The Grill Audience &{' '}
          </span>
          <HighlightedText size='sm' rotate={3}>
            Monetize
          </HighlightedText>
          <span className='relative z-10'> Existing Ones</span>
        </Heading>
        <div className='flex flex-col gap-6 md:gap-10'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-7'>
            <div className='flex items-center gap-3'>
              <Image
                src={PinkHeartImage}
                alt=''
                className='w-16 flex-shrink-0 md:w-24 lg:w-36'
              />
              <span className='text-lg text-[#FEEFFB] md:text-xl lg:text-2xl'>
                You start earning from the first post and the first like
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <Image
                src={LikesImage}
                alt=''
                className='w-16 flex-shrink-0 md:w-24 lg:w-36'
              />
              <span className='text-lg text-[#FEEFFB] md:text-xl lg:text-2xl'>
                You don’t need thousands of subscribers or 5 million views
              </span>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='flex flex-col rounded-3xl bg-white/5 p-5'>
              <span className='mb-2.5 text-lg text-[#FEEFFB] md:text-xl lg:text-2xl'>
                Possible rewards per post
              </span>
              <span className='mb-1.5 text-3xl font-bold md:text-4xl lg:text-5xl'>
                ≈ 1000 SUB
              </span>
              <span className='text-lg text-white/70 md:text-xl'>≈ $10.45</span>
            </div>
            <div className='flex flex-col rounded-3xl bg-white/5 p-5'>
              <span className='mb-2.5 text-lg text-[#FEEFFB] md:text-xl lg:text-2xl'>
                Possible rewards per comment
              </span>
              <span className='mb-1.5 text-3xl font-bold md:text-4xl lg:text-5xl'>
                ≈ 100 SUB
              </span>
              <span className='text-lg text-white/70 md:text-xl'>≈ $1.34</span>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <span className='text-2xl font-medium md:text-3xl md:font-bold'>
              The easiest way in the market to monetize your blogging is on
              Grill
            </span>
            <span className='relative text-lg text-[#FEEFFB] md:text-2xl'>
              <span className='relative z-10'>
                Other social media do not give effective monetization of your
                audience’s engagement, but we do! Invite them to interact with
                your content on Grill, and get{' '}
              </span>
              <HighlightedText size='xs' roundings='lg' rotate={3}>
                rewards for each like!
              </HighlightedText>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
