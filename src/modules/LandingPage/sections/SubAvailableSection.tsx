import Hydradx from '@/assets/graphics/landing/hydradx.png'
import Mexc from '@/assets/graphics/landing/mexc.png'
import StellaSwap from '@/assets/graphics/landing/stellaswap.png'
import TokenBgDesktop from '@/assets/graphics/landing/token-bg-desktop.png'
import TokenBg from '@/assets/graphics/landing/token-bg.png'
import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import BgGradient from '../common/BgGradient'
import Heading from '../common/Heading'

export default function SubAvailableSection(props: ComponentProps<'section'>) {
  const sendEvent = useSendEvent()
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <BgGradient
        color='green'
        className='absolute left-32 top-3/4 h-[731px] w-[731px] -translate-x-full -translate-y-full xl:left-12'
      />
      <div className='relative overflow-clip rounded-3xl px-4 py-8 pb-4 lg:p-10'>
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
          <Heading withMargin>SUB Token Is Available On</Heading>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6'>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-6 text-center backdrop-blur-2xl lg:p-8'>
              <Image src={Mexc} className='h-8 w-auto md:h-10' alt='' />
              <span className='-mt-1 text-lg sm:mt-0 sm:text-xl lg:text-2xl'>
                View Instructions
              </span>
              <Button
                variant='landingPrimary'
                roundings='xl'
                size='xl'
                href='https://www.youtube.com/watch?v=Hggz8sEM2Wk&list=PL5WL9aalTKGwNwY94n8nz8TOd7JVdQdfF&index=2'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() =>
                  sendEvent('lp_get_sub', {
                    value: 'mexc',
                    eventSource: 'sub-available-section',
                  })
                }
              >
                Get SUB
              </Button>
            </div>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-6 text-center backdrop-blur-2xl lg:p-8'>
              <Image src={Hydradx} className='h-8 w-auto md:h-10' alt='' />
              <span className='-mt-1 text-lg sm:mt-0 sm:text-xl lg:text-2xl'>
                View Instructions
              </span>
              <Button
                variant='landingPrimary'
                roundings='xl'
                size='xl'
                href='https://www.youtube.com/watch?v=Gs0y3FECzro&list=PL5WL9aalTKGwNwY94n8nz8TOd7JVdQdfF'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() =>
                  sendEvent('lp_get_sub', {
                    value: 'hydradx',
                    eventSource: 'sub-available-section',
                  })
                }
              >
                Get SUB
              </Button>
            </div>
            <div className='flex flex-col items-center gap-4 rounded-3xl border border-[#412C63] bg-white/5 p-6 text-center backdrop-blur-2xl lg:p-8'>
              <Image src={StellaSwap} className='h-8 w-auto md:h-10' alt='' />
              <span className='-mt-1 text-lg sm:mt-0 sm:text-xl lg:text-2xl'>
                View Instructions
              </span>
              <Button
                variant='landingPrimary'
                roundings='xl'
                size='xl'
                href='https://docs.subsocial.network/docs/tutorials/GetSUB/stellaswap'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() =>
                  sendEvent('lp_get_sub', {
                    value: 'stellaswap',
                    eventSource: 'sub-available-section',
                  })
                }
              >
                Get SUB
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
