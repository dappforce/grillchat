import One from '@/assets/graphics/landing/1.svg'
import Two from '@/assets/graphics/landing/2.svg'
import Three from '@/assets/graphics/landing/3.svg'
import Four from '@/assets/graphics/landing/4.svg'
import Diamond from '@/assets/graphics/landing/diamond.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import BgGradient from '../common/BgGradient'
import Heading from '../common/Heading'

export default function HowItWorksSection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <BgGradient
        translate={{ x: '-100%' }}
        className='absolute bottom-0 left-24 h-[731px] w-[731px] bg-[#4F46E5C4]'
      />
      <Image
        src={Diamond}
        alt=''
        className='unselectable absolute -left-10 top-0 hidden h-32 w-32 -translate-x-full rotate-[30deg] opacity-40 blur-sm lg:block'
      />
      <div className='relative flex flex-col'>
        <Heading withMargin className='relative mx-auto max-w-max'>
          <Image
            src={Diamond}
            alt=''
            className='unselectable absolute -bottom-3 -left-4 h-28 w-28 -translate-x-1/2 rotate-[30deg] opacity-40 blur-sm lg:hidden'
          />
          How Does It Work?
        </Heading>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5'>
          <Step
            numberIcon={One}
            title='Stake SUB'
            content='Every user who stakes at least 2000 SUB can monetize their social activity'
          />
          <Step
            numberIcon={Two}
            title='Like to Earn'
            content='When you like someone’s content, you earn extra rewards in SUB tokens'
          />
          <Step
            numberIcon={Three}
            title='Post to Earn'
            content='When someone likes your post or comment, you receive a reward'
          />
          <Step
            numberIcon={Four}
            title='Even More!'
            content='When someone likes a comment under your post, you and the comment’s author both receive a reward in the ratio of 30% to 70%'
          />
        </div>
      </div>
    </section>
  )
}

function Step({
  content,
  numberIcon: NumberIcon,
  title,
}: {
  title: string
  numberIcon: (props: { className: string }) => JSX.Element
  content: string
}) {
  return (
    <div className='flex items-center gap-4 rounded-3xl bg-white/5 px-4 py-5 sm:px-6 sm:py-8 lg:flex-col lg:items-center lg:gap-0 lg:pb-8 lg:pt-10'>
      <div className='flex w-16 flex-shrink-0 items-center justify-center md:w-20 lg:mb-8'>
        <NumberIcon className='text-[72px] md:text-[82px]' />
      </div>
      <div className='flex flex-col gap-1.5 lg:gap-0 lg:pb-0'>
        <span className='text-xl font-bold md:text-2xl lg:mb-2'>{title}</span>
        <p className='text-lg text-[#FEEFFB] md:text-xl'>{content}</p>
      </div>
    </div>
  )
}
