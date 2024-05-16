import EllipseLeft from '@/assets/graphics/home/ellipse-left.png'
import EllipseRight from '@/assets/graphics/home/ellipse-right.png'
import Laugh from '@/assets/graphics/home/laugh.png'
import Meme1 from '@/assets/graphics/home/meme-1.png'
import Meme2 from '@/assets/graphics/home/meme-2.png'
import Money from '@/assets/graphics/home/money.png'
import EpicMemes from '@/assets/logo/epic-memes.svg'
import { spaceGrotesk } from '@/fonts'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div
      className={cx(
        'flex h-screen flex-col items-center justify-center overflow-clip bg-background-primary px-4 text-white',
        spaceGrotesk.className
      )}
      style={{ height: '100dvh' }}
    >
      <div className='relative max-w-screen-lg text-center'>
        <Image
          src={EllipseLeft}
          alt=''
          className='pointer-events-none absolute left-0 top-0 h-[926px] w-[926px] -translate-x-2/3 -translate-y-1/2 select-none'
        />
        <Image
          src={EllipseRight}
          alt=''
          className='pointer-events-none absolute bottom-0 right-0 h-[1131px] w-[1131px] translate-x-1/2 translate-y-1/2 select-none'
        />
        <Image
          src={Laugh}
          alt=''
          className='pointer-events-none absolute -top-14 left-0 h-[178px] w-[178px] -translate-x-1/3 -rotate-[24deg] select-none opacity-[0.66]'
        />
        <Image
          src={Money}
          alt=''
          className='pointer-events-none absolute -top-12 right-0 h-[195px] w-[195px] translate-x-1/4 rotate-[17deg] select-none opacity-[0.87]'
        />
        <Image
          src={Money}
          alt=''
          className='pointer-events-none absolute -top-12 right-0 h-[61px] w-[61px] translate-x-[300%] rotate-[72deg] select-none opacity-[0.48] blur-[2px]'
        />

        <div className='relative z-10 flex flex-col items-center gap-16'>
          <h1 className='hidden'>Epic Meme2Earn</h1>
          <EpicMemes className='h-[15vh]' />
          <h2 className='text-4xl font-medium'>
            Earn meme coins 💰 by posting and liking memes 🤣
          </h2>
          <div className='grid grid-cols-2 gap-8'>
            <Link
              href='https://epicapp.net/what-is-meme2earn'
              className='flex flex-col gap-4 rounded-[30px] bg-white/20 p-8 outline-none ring-8 ring-inset ring-transparent transition hover:ring-[#F9E539] focus-visible:ring-[#F9E539] active:bg-[#F9E539] active:text-background-primary'
            >
              <Image className='h-[30vh] object-contain' src={Meme1} alt='' />
              <span className='text-3xl font-bold'>LEARN MORE</span>
            </Link>
            <Link
              href='/memes'
              className='flex flex-col gap-4 rounded-[30px] bg-white/20 p-8 outline-none ring-8 ring-inset ring-transparent transition hover:ring-[#F9E539] focus-visible:ring-[#F9E539] active:bg-[#F9E539] active:text-background-primary'
            >
              <Image
                className='h-[30vh] object-cover object-right-top'
                src={Meme2}
                alt=''
              />
              <span className='text-3xl font-bold'>OPEN APP</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
