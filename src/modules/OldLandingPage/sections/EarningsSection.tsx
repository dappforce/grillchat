import ActivitiesImage from '@/assets/graphics/landing/activities.png'
import Diamond from '@/assets/graphics/landing/diamond.png'
import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { cx, getBlurFallbackStyles } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import BgGradient from '../common/BgGradient'
import Heading from '../common/Heading'

export default function EarningsSection(props: ComponentProps<'section'>) {
  const sendEvent = useSendEvent()
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <BgGradient
        color='blue'
        className='absolute -top-52 right-48 h-[855px] w-[855px] translate-x-full'
      />
      <Image
        src={Diamond}
        alt=''
        style={getBlurFallbackStyles({ rotate: '-30deg' })}
        className='unselectable absolute -left-4 -top-16 h-24 w-24 opacity-60 blur-[2px] xl:-left-32 xl:h-40 xl:w-40 xl:opacity-80'
      />
      <div className='relative flex flex-col'>
        <Heading withMargin>What Others Earn Here</Heading>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7'>
          <div className='flex flex-col rounded-3xl bg-white/5 p-5 text-center sm:text-left'>
            <span className='mb-1.5 text-lg text-[#FEEFFB] sm:mb-3 sm:text-xl lg:text-2xl'>
              Earned by users and bloggers last month
            </span>
            <span className='mb-1.5 mt-auto text-3xl font-bold sm:text-4xl lg:text-5xl'>
              1M+ SUB
            </span>
            <span className='text-lg text-white/70 sm:text-xl'>≈ $10,234</span>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/5 p-5 text-center sm:text-left'>
            <span className='mb-1.5 text-lg text-[#FEEFFB] sm:mb-3 sm:text-xl lg:text-2xl'>
              Earned by top users on a single post
            </span>
            <span className='mb-1.5 mt-auto text-3xl font-bold sm:text-4xl lg:text-5xl'>
              1000+ SUB
            </span>
            <span className='text-lg text-white/70 sm:text-xl'>
              ≈ $11 per post
            </span>
          </div>
          <Image
            src={ActivitiesImage}
            className='w-full rounded-3xl sm:col-span-2'
            alt=''
          />
          <div className='flex flex-col items-center justify-between gap-4 rounded-3xl bg-white/5 px-5 py-6 sm:col-span-2 md:flex-row'>
            <span className='text-center text-xl font-medium md:text-left md:text-2xl'>
              Check out the statistics of how others earn on our platform:
            </span>
            <Button
              className='flex-shrink-0'
              variant='landingPrimary'
              size='xl'
              roundings='xl'
              href='https://grillapp.net/leaderboard'
              onClick={() => sendEvent('lp_live_stats')}
            >
              See Live Stats
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
