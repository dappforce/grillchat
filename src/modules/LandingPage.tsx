import Laugh from '@/assets/emojis/laugh.png'
import EllipseLeft from '@/assets/graphics/home/ellipse-left.png'
import EllipseRight from '@/assets/graphics/home/ellipse-right.png'
import Meme1 from '@/assets/graphics/home/meme-1.png'
import Meme2 from '@/assets/graphics/home/meme-2.png'
import Money from '@/assets/graphics/home/money.png'
import EpicMemes from '@/assets/logo/epic-memes.svg'
import { spaceGrotesk } from '@/fonts'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  const sendEvent = useSendEvent()
  return (
    <div
      className={cx(
        'flex h-screen flex-col items-center justify-center overflow-clip bg-background-primary px-4 text-white',
        spaceGrotesk.className
      )}
      style={{ height: '100dvh' }}
    >
      <div className='relative flex w-full max-w-screen-lg flex-1 flex-col text-center sm:flex-initial'>
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
          className='pointer-events-none absolute right-0 top-4 h-[111px] w-[111px] -translate-y-1/4 translate-x-1/3 rotate-[27deg] select-none opacity-[0.66] sm:-top-14 sm:left-0 sm:right-auto sm:h-[178px] sm:w-[178px] sm:-translate-x-1/3 sm:translate-y-0 sm:-rotate-[24deg]'
        />
        <Image
          src={Money}
          alt=''
          className='pointer-events-none absolute left-0 top-1/3 h-[69px] w-[69px] -translate-x-1/2 rotate-[26deg] select-none opacity-[0.87] sm:-top-12 sm:left-auto sm:right-0 sm:h-[195px] sm:w-[195px] sm:translate-x-1/4 sm:rotate-[17deg]'
        />
        <Image
          src={Money}
          alt=''
          className='pointer-events-none absolute right-4 top-1/2 h-[73px] w-[73px] -rotate-[26deg] select-none opacity-[0.48] blur-[2px] sm:-top-12 sm:right-0 sm:h-[61px] sm:w-[61px] sm:translate-x-[300%] sm:rotate-[72deg]'
        />

        <div className='relative z-10 flex w-full flex-1 flex-col items-center py-12 sm:gap-16'>
          <h1 className='hidden'>Epic Meme2Earn</h1>
          <EpicMemes className='mb-12 mt-auto w-44 sm:mb-0 sm:h-[15vh] sm:max-w-72' />
          <h2 className='mb-8 max-w-64 text-2xl font-medium sm:mb-0 sm:max-w-none sm:text-4xl'>
            Earn meme coins 💰 by posting and liking memes 🤣
          </h2>
          <div className='mt-auto grid w-full grid-cols-1 gap-8 sm:mt-0 sm:grid-cols-2'>
            <Link
              href='https://epicapp.net/what-is-meme2earn'
              className='flex items-center gap-4 rounded-[30px] bg-white/20 p-4 outline-none ring-8 ring-inset ring-transparent transition hover:bg-[#F9E539] hover:text-background-primary focus-visible:bg-[#F9E539] focus-visible:text-background-primary sm:flex-col sm:p-8'
              onClick={() => sendEvent('lp_learn_more')}
            >
              <Image
                className='h-28 w-24 object-contain sm:h-[20vh] sm:w-auto md:h-[30vh]'
                src={Meme1}
                alt=''
              />
              <span className='text-xl font-bold sm:text-3xl'>LEARN MORE</span>
            </Link>
            <Link
              href='/tg'
              className='flex items-center gap-4 rounded-[30px] bg-white/20 p-4 outline-none ring-8 ring-inset ring-[#F9E539] transition hover:bg-[#F9E539] hover:text-background-primary focus-visible:bg-[#F9E539] focus-visible:text-background-primary sm:flex-col sm:p-8'
              onClick={() => sendEvent('lp_open_app')}
            >
              <Image
                className='h-28 w-24 object-cover object-right py-4 sm:h-[20vh] sm:w-auto sm:object-cover sm:object-right-top sm:py-0 md:h-[30vh]'
                src={Meme2}
                alt=''
              />
              <span className='text-xl font-bold sm:text-3xl'>OPEN APP</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
