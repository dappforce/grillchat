import BgImage from '@/assets/graphics/landing/bg.png'
import MoneyImage from '@/assets/graphics/landing/moneybag.png'
import ThumbsUpImage from '@/assets/graphics/landing/thumbsup.png'
import WritingImage from '@/assets/graphics/landing/writing.png'
import Grill from '@/assets/logo/grill.svg'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps, forwardRef } from 'react'
import { HiChevronRight } from 'react-icons/hi2'
import Heading from '../common/Heading'

const HeroSection = forwardRef<HTMLDivElement, ComponentProps<'section'>>(
  ({ ...props }, ref) => {
    return (
      <section
        {...props}
        className={cx(
          'relative flex min-h-screen flex-col justify-center py-12 sm:py-16',
          props.className
        )}
        ref={ref}
      >
        <Image
          src={BgImage}
          alt=''
          className='unselectable absolute inset-0 h-full w-full object-cover object-right opacity-30'
        />
        <div className='absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#0F172A] to-transparent' />
        <div className='relative flex flex-1 flex-col justify-between sm:justify-around'>
          <div />
          <div className='mb-[clamp(0px,_4vh,_4rem)] flex flex-col gap-8 sm:mb-0 md:gap-12 lg:gap-[8vh]'>
            <div className='flex flex-col items-center gap-8 sm:gap-12'>
              <div className='flex items-center justify-center'>
                <Grill className='text-6xl md:text-7xl lg:text-[clamp(70px,_9vh,_88px)]' />
              </div>
              <div className='flex flex-col gap-4 text-center sm:gap-6'>
                <Heading
                  as='h1'
                  className='lg:text-[clamp(2.75rem,_6vh,_3rem)]'
                >
                  Monetize Every Like, Comment, And Post
                </Heading>
                <h2 className='text-xl font-medium text-[#FEEFFB] sm:text-2xl'>
                  Revolutionary social platform where bloggers and their
                  followers earn together
                </h2>
              </div>
            </div>
            <div className='flex w-full items-center justify-center gap-1 lg:gap-6'>
              <div className='flex basis-60 flex-col items-center justify-center gap-5 rounded-3xl bg-white/5 px-4 py-5 backdrop-blur-sm sm:p-8'>
                <Image src={WritingImage} className='w-9 sm:w-14' alt='' />
                <span className='text-2xl font-bold sm:text-3xl'>Post</span>
              </div>
              <span className='flex-shrink-0 text-2xl text-[#7B77E0] sm:text-4xl'>
                <HiChevronRight />
              </span>
              <div className='flex basis-60 flex-col items-center justify-center gap-5 rounded-3xl bg-white/5 px-4 py-5 backdrop-blur-sm sm:p-8'>
                <Image src={ThumbsUpImage} className='w-9 sm:w-14' alt='' />
                <span className='text-2xl font-bold sm:text-3xl'>Like</span>
              </div>
              <span className='flex-shrink-0 text-2xl text-[#7B77E0] sm:text-4xl'>
                <HiChevronRight />
              </span>
              <div className='flex basis-60 flex-col items-center justify-center gap-3 rounded-3xl bg-white/5 px-4 py-5 backdrop-blur-sm sm:p-8'>
                <Image src={MoneyImage} className='w-12 sm:w-16' alt='' />
                <span className='text-2xl font-bold sm:text-3xl'>Earn</span>
              </div>
            </div>
          </div>
          <div className='mt-8 flex flex-col items-center gap-6 sm:mb-[4vh] sm:mt-[max(4rem,_4vh)]'>
            <div className='flex w-full flex-col-reverse justify-center gap-3 text-lg sm:flex-row sm:items-center sm:gap-4'>
              <Button variant='landingPrimaryOutline' size='xl' roundings='xl'>
                Ask Questions
              </Button>
              <Button variant='landingPrimary' size='xl' roundings='xl'>
                Start Earning
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }
)
HeroSection.displayName = 'HeroSection'

export default HeroSection
