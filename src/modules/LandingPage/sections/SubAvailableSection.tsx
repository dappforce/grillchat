import Hydradx from '@/assets/graphics/landing/hydradx.png'
import Mexc from '@/assets/graphics/landing/mexc.png'
import StellaSwap from '@/assets/graphics/landing/stellaswap.png'
import TokenBgDesktop from '@/assets/graphics/landing/token-bg-desktop.png'
import TokenBg from '@/assets/graphics/landing/token-bg.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import Heading from '../common/Heading'

export default function SubAvailableSection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <div className='absolute left-32 top-3/4 h-[731px] w-[731px] -translate-x-full -translate-y-full rounded-full bg-[#33A6BF94] blur-[239px]' />
      <div className='relative overflow-clip rounded-3xl px-4 py-8 lg:p-10'>
        <Image
          src={TokenBgDesktop}
          alt=''
          className='unselectable absolute inset-0 hidden h-full w-full object-cover object-top md:block'
        />
        <Image
          src={TokenBg}
          alt=''
          className='unselectable absolute inset-0 h-full w-full object-cover object-left-top md:hidden'
        />
        <div className='relative flex flex-col'>
          <Heading className='mb-6 md:mb-10'>SUB Token Is Available On</Heading>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6'>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-6 text-center backdrop-blur-2xl lg:p-8'>
              <Image src={Mexc} className='h-8 w-auto md:h-10' alt='' />
              <span className='-mt-1 text-lg sm:mt-0 sm:text-xl lg:text-2xl'>
                View Instructions
              </span>
              <Button variant='landingPrimary' roundings='xl' size='xl'>
                Get SUB
              </Button>
            </div>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-6 text-center backdrop-blur-2xl lg:p-8'>
              <Image src={Hydradx} className='h-8 w-auto md:h-10' alt='' />
              <span className='-mt-1 text-lg sm:mt-0 sm:text-xl lg:text-2xl'>
                View Instructions
              </span>
              <Button variant='landingPrimary' roundings='xl' size='xl'>
                Get SUB
              </Button>
            </div>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-6 text-center backdrop-blur-2xl lg:p-8'>
              <Image src={StellaSwap} className='h-8 w-auto md:h-10' alt='' />
              <span className='-mt-1 text-lg sm:mt-0 sm:text-xl lg:text-2xl'>
                View Instructions
              </span>
              <Button variant='landingPrimary' roundings='xl' size='xl'>
                Get SUB
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
