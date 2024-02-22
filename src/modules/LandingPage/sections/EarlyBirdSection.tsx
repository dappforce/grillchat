import Attraction from '@/assets/graphics/landing/attraction.svg'
import Competition from '@/assets/graphics/landing/competition.svg'
import IncreasedRewards from '@/assets/graphics/landing/increased-rewards.svg'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import Heading from '../common/Heading'

export default function EarlyBirdSection(props: ComponentProps<'section'>) {
  return (
    <section {...props} className={cx('mx-auto max-w-6xl', props.className)}>
      <div className='flex flex-col items-center gap-10'>
        <Heading>Early-Bird Benefits</Heading>
        <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-7'>
          <div className='flex flex-col rounded-3xl bg-white/10 p-5 md:p-6 md:pb-8 md:pt-10'>
            <div className='mb-4 flex items-center justify-center md:mb-8'>
              <Competition className='w-16 sm:w-24' />
            </div>
            <p className='text-center text-lg text-[#FEEFFB] md:text-left md:text-xl'>
              The earlier you join, the lower the competition
            </p>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/10 p-5 md:p-6 md:pb-8 md:pt-10'>
            <div className='mb-4 flex items-center justify-center md:mb-8'>
              <Attraction className='w-16 sm:w-24' />
            </div>
            <p className='text-center text-lg text-[#FEEFFB] md:text-left md:text-xl'>
              Your content will be much more visible and attract more attention
            </p>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/10 p-5 md:p-6 md:pb-8 md:pt-10'>
            <div className='mb-4 flex items-center justify-center md:mb-8'>
              <IncreasedRewards className='w-16 sm:w-24' />
            </div>
            <p className='text-center text-lg text-[#FEEFFB] md:text-left md:text-xl'>
              Currently, the platform offers increased rewards for every action
              you take
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
