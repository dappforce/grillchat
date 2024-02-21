import Attraction from '@/assets/graphics/landing/attraction.svg'
import Competition from '@/assets/graphics/landing/competition.svg'
import IncreasedRewards from '@/assets/graphics/landing/increased-rewards.svg'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export default function EarlyBirdSection(props: ComponentProps<'section'>) {
  return (
    <section {...props} className={cx('mx-auto max-w-6xl', props.className)}>
      <div className='flex flex-col items-center gap-10'>
        <h3 className='text-center text-5xl font-bold'>Early-Bird Benefits</h3>
        <div className='grid grid-cols-3 gap-7'>
          <div className='flex flex-col rounded-3xl bg-white/10 p-6 pb-8 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <Competition className='w-24' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              The earlier you join, the lower the competition
            </p>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/10 p-6 pb-8 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <Attraction className='w-24' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              Your content will be much more visible and attract more attention
            </p>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/10 p-6 pb-8 pt-10'>
            <div className='mb-8 flex items-center justify-center'>
              <IncreasedRewards className='w-24' />
            </div>
            <p className='text-xl text-[#FEEFFB]'>
              Currently, the platform offers increased rewards for every action
              you take
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
