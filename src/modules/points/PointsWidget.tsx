import Diamond from '@/assets/emojis/diamond.png'
import Thumbsup from '@/assets/emojis/thumbsup.png'
import Card from '@/components/Card'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { HiXMark } from 'react-icons/hi2'
import { Drawer } from 'vaul'

export default function PointsWidget(props: ComponentProps<'div'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Drawer.Root shouldScaleBackground direction='top'>
      <Drawer.Trigger asChild>
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
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 z-10 h-full w-full bg-black/50 backdrop-blur-lg' />
        <Drawer.Content className='fixed inset-0 z-10 flex h-full w-full flex-col rounded-t-[10px] bg-transparent'>
          <Drawer.Close className='absolute right-4 top-4'>
            <HiXMark className='text-3xl' />
          </Drawer.Close>
          <div className='align-center flex h-full justify-center'>
            <div className='flex items-center gap-3'>
              <Image src={Diamond} alt='' className='h-14 w-14' />
              <span className='text-4xl font-bold'>
                {formatNumber('134459')}
              </span>
            </div>
            <div className='flex flex-col gap-4'>
              <span className='text-lg font-bold text-text-muted'>
                How to earn Points:
              </span>
              <Card className='flex items-center gap-3'></Card>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

{
  /* <div className='fixed inset-0 z-10 h-full w-full bg-black/50 backdrop-blur-lg'>
asdfsadf
</div> */
}
