import BgImage from '@/assets/graphics/landing/bg.png'
import MoneyImage from '@/assets/graphics/landing/moneybag.png'
import ThumbsUpImage from '@/assets/graphics/landing/thumbsup.png'
import WritingImage from '@/assets/graphics/landing/writing.png'
import Grill from '@/assets/logo/grill.svg'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import { HiChevronRight } from 'react-icons/hi2'

export default function HeroSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx(
        'relative flex min-h-screen flex-col justify-center py-16',
        props.className
      )}
    >
      <Image
        src={BgImage}
        alt=''
        className='absolute inset-0 h-full w-full select-none object-cover object-right opacity-30'
      />
      <div className='absolute bottom-0 h-40 w-full bg-gradient-to-t from-[#0F172A] to-transparent' />
      <div className='relative flex flex-col gap-[8vh]'>
        <div className='flex flex-col items-center gap-12'>
          <Grill className='text-[88px]' />
          <div className='flex flex-col gap-6 text-center'>
            <h1 className='text-5xl font-bold'>
              Monetize Every Like, Comment, And Post
            </h1>
            <h2 className='text-2xl font-medium text-[#FEEFFB]'>
              Revolutionary social platform where bloggers and their followers
              earn together
            </h2>
          </div>
        </div>
        <div className='flex w-full items-center justify-center gap-6'>
          <div className='flex basis-60 flex-col items-center justify-center gap-5 rounded-3xl bg-white/5 p-8 backdrop-blur-sm'>
            <Image src={WritingImage} className='w-14' alt='' />
            <span className='text-3xl font-bold'>Post</span>
          </div>
          <span className='text-4xl text-[#7B77E0]'>
            <HiChevronRight />
          </span>
          <div className='flex basis-60 flex-col items-center justify-center gap-5 rounded-3xl bg-white/5 p-8 backdrop-blur-sm'>
            <Image src={ThumbsUpImage} className='w-14' alt='' />
            <span className='text-3xl font-bold'>Like</span>
          </div>
          <span className='text-4xl text-[#7B77E0]'>
            <HiChevronRight />
          </span>
          <div className='flex basis-60 flex-col items-center justify-center gap-3 rounded-3xl bg-white/5 p-8 backdrop-blur-sm'>
            <Image src={MoneyImage} className='w-16' alt='' />
            <span className='text-3xl font-bold'>Earn</span>
          </div>
        </div>
        <div className='flex flex-col items-center gap-6'>
          <span className='text-2xl font-medium text-[#FEEFFB]'>
            Early-bird version
          </span>
          <div className='flex items-center gap-2 text-lg'>
            <Button variant='transparent' size='xl' roundings='xl'>
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
