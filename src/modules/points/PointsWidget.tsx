import Diamond from '@/assets/emojis/diamond.png'
import Laugh from '@/assets/emojis/laugh.png'
import Pointup from '@/assets/emojis/pointup.png'
import Speaker from '@/assets/emojis/speaker.png'
import Thumbsup from '@/assets/emojis/thumbsup.png'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import Image from 'next/image'
import { ComponentProps } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { HiChevronRight, HiXMark } from 'react-icons/hi2'
import { Drawer } from 'vaul'

export default function PointsWidget(props: ComponentProps<'div'>) {
  const sendEvent = useSendEvent()
  return (
    <Drawer.Root
      shouldScaleBackground
      direction='top'
      onOpenChange={(open) => {
        // To make bottom menu still clickable when this drawer is open
        if (open) setTimeout(() => (document.body.style.pointerEvents = ''), 0)
      }}
    >
      <Drawer.Trigger asChild>
        <div
          {...props}
          className={cx(
            'flex w-full cursor-pointer items-center justify-between rounded-b-2xl bg-black/50 px-4.5 py-3 backdrop-blur-xl',
            props.className
          )}
          onClick={() => {
            sendEvent('widget_expanded')
          }}
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
        <Drawer.Content className='fixed inset-0 z-10 flex h-full max-h-[calc(100dvh_-_6rem)] w-full flex-col justify-center rounded-t-[10px] bg-transparent outline-none'>
          <Drawer.Close className='absolute right-4 top-4'>
            <HiXMark className='text-3xl' />
          </Drawer.Close>
          <div className='mx-auto flex h-full max-h-[650px] w-full max-w-screen-md flex-col items-center justify-evenly overflow-auto px-4 pt-8'>
            <div className='flex items-center gap-3'>
              <Image src={Diamond} alt='' className='h-14 w-14' />
              <span className='text-4xl font-bold'>
                {formatNumber('134459')}
              </span>
            </div>
            <div className='flex w-full flex-col gap-4'>
              <span className='text-center text-lg font-bold text-text-muted'>
                How to earn Points:
              </span>
              <Card className='flex w-full items-center gap-4 bg-background-light'>
                <Image
                  src={Pointup}
                  alt=''
                  className='h-14 w-14 flex-shrink-0'
                />
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-bold'>Tap2Earn</span>
                    <div className='rounded-full bg-background px-2 py-0.5 text-sm text-text-muted'>
                      Soon
                    </div>
                  </div>
                  <p className='text-sm text-text-muted'>
                    Tap on the laughing emoji and earn Points.
                  </p>
                </div>
                <Button
                  size='circle'
                  className='ml-auto flex-shrink-0 text-lg'
                  variant='transparent'
                >
                  <HiChevronRight />
                </Button>
              </Card>
              <Card className='flex w-full items-center gap-4 bg-background-light'>
                <Image src={Laugh} alt='' className='h-14 w-14 flex-shrink-0' />
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-bold'>Meme2Earn</span>
                  </div>
                  <p className='text-sm text-text-muted'>
                    Post and like memes to earn even more Points.
                  </p>
                </div>
                <Button
                  size='circle'
                  className='ml-auto flex-shrink-0 text-lg'
                  variant='transparent'
                >
                  <HiChevronRight />
                </Button>
              </Card>
              <Card className='flex w-full items-center gap-4 bg-background-light'>
                <Image
                  src={Speaker}
                  alt=''
                  className='h-14 w-14 flex-shrink-0'
                />
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-bold'>Invite2Earn</span>
                  </div>
                  <p className='text-sm text-text-muted'>
                    Invite your friends and earn 10% from their Points.
                  </p>
                </div>
                <Button
                  size='circle'
                  className='ml-auto flex-shrink-0 text-lg'
                  variant='transparent'
                >
                  <HiChevronRight />
                </Button>
              </Card>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}