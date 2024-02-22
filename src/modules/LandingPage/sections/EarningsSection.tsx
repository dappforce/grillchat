import ActivitiesImage from '@/assets/graphics/landing/activities.png'
import Diamond from '@/assets/graphics/landing/diamond.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import Heading from '../common/Heading'

export default function EarningsSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <div className='absolute -top-52 right-0 h-[855px] w-[855px] translate-x-1/2 rounded-full bg-[#5D88F0A8] blur-[478px]' />
      <Image
        src={Diamond}
        alt=''
        className='unselectable absolute -top-24 right-4 h-24 w-24 -rotate-[30deg] opacity-60 blur-[2px] xl:-right-8 xl:top-64 xl:h-40 xl:w-40 xl:translate-x-full '
      />
      <div className='relative flex flex-col'>
        <Heading className='mb-10'>What Others Earn</Heading>
        <div className='grid grid-cols-1 gap-7 sm:grid-cols-2'>
          <div className='flex flex-col rounded-3xl bg-white/5 p-5'>
            <span className='mb-3 text-lg text-[#FEEFFB] sm:text-xl lg:text-2xl'>
              Earned by users and bloggers last month
            </span>
            <span className='mb-1.5 mt-auto text-3xl font-bold sm:text-4xl lg:text-5xl'>
              1M+ SUB
            </span>
            <span className='text-lg text-white/70 sm:text-xl'>≈ $10,234</span>
          </div>
          <div className='flex flex-col rounded-3xl bg-white/5 p-5'>
            <span className='mb-3 text-lg text-[#FEEFFB] sm:text-xl lg:text-2xl'>
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
            >
              See Live Stats
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
