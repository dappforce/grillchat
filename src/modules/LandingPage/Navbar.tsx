import Grill from '@/assets/logo/grill.svg'
import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import { Transition } from '@headlessui/react'

export default function Navbar({
  className,
  isShowing,
}: {
  isShowing?: boolean
  className?: string
}) {
  return (
    <Transition
      as='nav'
      show={isShowing}
      enter='duration-300'
      enterFrom='opacity-0 -top-12'
      enterTo='opacity-100 top-0'
      leave='duration-150'
      leaveFrom='opacity-100 top-0'
      leaveTo='opacity-0 -top-12'
      className={cx(
        'fixed left-0 z-30 w-full bg-[#17040F33] backdrop-blur-md transition-all',
        className
      )}
    >
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-[70px]'>
        <div>
          <Grill className='text-[28px] sm:text-4xl' />
        </div>
        <div className='flex items-center gap-4'>
          <Button
            variant='landingPrimaryOutline'
            className='hidden px-4.5 py-2 text-lg sm:block'
            roundings='xl'
            href='/ask'
          >
            Ask Questions
          </Button>
          <Button
            variant='landingPrimary'
            className='px-4 py-1 text-lg sm:px-4.5 sm:py-2'
            roundings='xl'
            href='/staking'
          >
            Start Earning
          </Button>
        </div>
      </div>
    </Transition>
  )
}
