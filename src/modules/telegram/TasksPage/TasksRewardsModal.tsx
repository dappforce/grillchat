import Diamond from '@/assets/emojis/diamond.png'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import { Transition } from '@headlessui/react'
import Image from 'next/image'

export type TasksRewardsModalProps = {
  reward: string
  close: () => void
}

export default function TasksRewardsModal({
  reward,
  close,
}: TasksRewardsModalProps) {
  return (
    <>
      <Transition
        appear
        show
        className='fixed inset-0 z-40 flex h-full w-full max-w-screen-md origin-center items-center justify-center transition duration-300'
        enterFrom={cx('opacity-0 scale-75')}
        enterTo={cx('opacity-100 scale-100')}
        leaveFrom={cx('opacity-100 scale-100')}
        leaveTo={cx('opacity-0 scale-75')}
        onClick={() => close()}
      >
        <div className='absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-background-primary/20 blur-3xl' />
        <div className='relative flex h-full flex-1 flex-col items-center justify-center gap-1 px-4 py-3'>
          <Image src={Diamond} alt='' className='h-12 w-12' />
          <span className='text-3xl font-bold'>{reward}</span>
          <span className='text-text/70'>Points earned!</span>

          <div className='absolute bottom-6 w-full px-4'>
            <Button
              variant='primary'
              className='w-full'
              size='lg'
              onClick={close}
            >
              Thank you!
            </Button>
          </div>
        </div>
      </Transition>
    </>
  )
}
