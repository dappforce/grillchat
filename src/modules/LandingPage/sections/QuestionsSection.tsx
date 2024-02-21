import Diamond from '@/assets/graphics/landing/diamond.png'
import QuestionMark from '@/assets/graphics/landing/question-mark.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'

export default function QuestionsSection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('relative mx-auto max-w-6xl', props.className)}>
      <div className='absolute left-1/2 top-1/2 h-[572px] w-[572px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5B5] blur-[239px]' />
      <Image
        src={QuestionMark}
        alt=''
        className='absolute -left-8 top-8 w-28 -translate-y-full -rotate-[27deg] opacity-75 blur-[2px]'
      />
      <Image
        src={QuestionMark}
        alt=''
        className='absolute -right-8 bottom-8 w-40 translate-y-1/2 rotate-[27deg] opacity-75 blur-sm'
      />
      <div className='relative flex flex-col items-center gap-6'>
        <Image src={Diamond} alt='' className='w-14' />
        <h3 className='text-center text-5xl font-bold'>
          Still Have Questions?
        </h3>
        <Button variant='landingPrimary' size='xl' roundings='xl'>
          Ask them here
        </Button>
      </div>
    </section>
  )
}
