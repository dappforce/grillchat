import Diamond from '@/assets/graphics/landing/diamond.png'
import QuestionMark from '@/assets/graphics/landing/question-mark.png'
import Button from '@/components/Button'
import { cx, getBlurFallbackStyles } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import BgGradient from '../common/BgGradient'
import Heading from '../common/Heading'

export default function QuestionsSection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <BgGradient
        color='dark-blue'
        className='absolute left-1/2 top-1/2 h-[572px] w-[572px] -translate-x-1/2 -translate-y-1/2'
      />
      <Image
        src={QuestionMark}
        alt=''
        style={getBlurFallbackStyles({
          rotate: '-27deg',
          translate: { y: '-100%' },
        })}
        className='unselectable absolute -left-8 top-8 w-28 opacity-75 blur-[2px]'
      />
      <Image
        src={QuestionMark}
        alt=''
        style={getBlurFallbackStyles({
          rotate: '27deg',
          translate: { y: '50%' },
        })}
        className='unselectable absolute -right-8 bottom-8 w-40 opacity-75 blur-sm'
      />
      <div className='relative flex flex-col items-center gap-6'>
        <Image src={Diamond} alt='' className='unselectable w-14' />
        <Heading>Still Have Questions?</Heading>
        <Button variant='landingPrimary' size='xl' roundings='xl'>
          Ask them here
        </Button>
      </div>
    </section>
  )
}
