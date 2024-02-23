import Diamond from '@/assets/graphics/landing/diamond.png'
import { cx, getBlurFallbackStyles } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import BgGradient from '../common/BgGradient'
import Heading from '../common/Heading'
import JoinSection from './JoinSection'

export default function VideoSection(props: ComponentProps<'section'>) {
  return (
    <section
      {...props}
      className={cx('relative mx-auto max-w-6xl', props.className)}
    >
      <Image
        src={Diamond}
        alt=''
        style={getBlurFallbackStyles()}
        className='unselectable absolute -right-4 -top-4 h-24 w-24 -translate-y-1/2 rotate-[18deg] opacity-60 blur-[3px] md:h-56 md:w-56 lg:-right-16 lg:h-44 lg:w-44 lg:translate-x-1/2 lg:rotate-[18deg] xl:h-56 xl:w-56'
      />
      <BgGradient
        translate={{ x: '-75%' }}
        className='absolute -left-20 -top-20 h-[731px] w-[731px] bg-[#4F46E5C4]'
      />
      <BgGradient
        translate={{ y: '100%', x: '100%' }}
        className='absolute -bottom-48 right-48 h-[731px] w-[731px] translate-x-3/4 rounded-full bg-[#D034E9A6] lg:bottom-32'
      />
      <div
        className={cx(
          'relative w-full overflow-hidden rounded-3xl bg-[linear-gradient(268deg,_#3F3CD5_6.17%,_#343292_96.71%)] to-[#343292] px-6 py-7 md:pt-10'
        )}
      >
        <div className='relative flex flex-col items-center text-center'>
          <Heading className='mb-2 lg:mb-4'>How To Start Earning?</Heading>
          <span className='mb-6 text-lg text-[#FEEFFB] sm:text-xl md:mb-10'>
            Watch the short video guide
          </span>
          <div className='flex aspect-video w-full max-w-2xl items-center justify-center rounded-3xl bg-white/10'>
            <Heading as='span'>Demo Video</Heading>
          </div>
        </div>
        <JoinSection
          className='-mx-6 -mb-7 mt-6'
          contentClassName='overflow-visible bg-none pt-0 static'
        />
      </div>
    </section>
  )
}
