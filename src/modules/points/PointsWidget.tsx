import Diamond from '@/assets/graphics/landing/diamond.png'
import Thumbsup from '@/assets/graphics/landing/thumbsup.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ComponentProps } from 'react'
import { FaChevronDown } from 'react-icons/fa'

export default function PointsWidget(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cx(
        'flex w-full items-center justify-between rounded-b-2xl bg-black/50 px-4.5 py-3 backdrop-blur-xl',
        props.className
      )}
    >
      <div className='flex items-center gap-2'>
        <Image className='h-6 w-6' src={Thumbsup} alt='' />
        <span className='text-xl font-bold'>10/10</span>
      </div>
      <div className='flex items-center gap-2'>
        <Image className='h-7 w-7' src={Diamond} alt='' />
        <span className='text-xl font-bold'>134,459</span>
        <FaChevronDown className='relative top-0.5' />
      </div>
    </div>
  )
}
