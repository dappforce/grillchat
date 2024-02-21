import Hydradx from '@/assets/graphics/landing/hydradx.png'
import Mexc from '@/assets/graphics/landing/mexc.png'
import StellaSwap from '@/assets/graphics/landing/stellaswap.png'
import TokenBg from '@/assets/graphics/landing/token-bg.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function SubAvailableSection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <div className='absolute left-32 top-3/4 h-[731px] w-[731px] -translate-x-full -translate-y-full rounded-full bg-[#33A6BF94] blur-[478px]' />
      <div className='relative overflow-clip rounded-3xl p-10'>
        <Image
          src={TokenBg}
          alt=''
          className='absolute inset-0 h-full w-full object-cover'
        />
        <div className='relative flex flex-col'>
          <h3 className='mb-10 text-center text-5xl font-bold'>
            SUB Token Is Available On
          </h3>
          <div className='grid grid-cols-3 gap-6'>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-8 text-center backdrop-blur-2xl'>
              <Image src={Mexc} className='mb-1 w-full max-w-[200px]' alt='' />
              <span className='text-2xl'>View Instructions</span>
              <Button variant='landingPrimary' roundings='xl' size='xl'>
                Get SUB
              </Button>
            </div>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-8 text-center backdrop-blur-2xl'>
              <Image
                src={Hydradx}
                className='mb-1 w-full max-w-[200px]'
                alt=''
              />
              <span className='text-2xl'>View Instructions</span>
              <Button variant='landingPrimary' roundings='xl' size='xl'>
                Get SUB
              </Button>
            </div>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-8 text-center backdrop-blur-2xl'>
              <Image
                src={StellaSwap}
                className='mb-1 w-full max-w-[200px]'
                alt=''
              />
              <span className='text-2xl'>View Instructions</span>
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
