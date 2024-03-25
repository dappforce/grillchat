import GrillKeyDark from '@/assets/graphics/grill-key-dark.svg'
import GrillKey from '@/assets/graphics/grill-key.svg'
import ShareSessionDark from '@/assets/graphics/share-session-dark.svg'
import ShareSession from '@/assets/graphics/share-session.svg'
import Button from '@/components/Button'
import { HiChevronRight } from 'react-icons/hi2'
import { ProfileModalContentProps } from '../types'

export default function PrivacySecurityContent({
  setCurrentState,
}: ProfileModalContentProps) {
  return (
    <div className='flex flex-col gap-4'>
      <Button
        variant='transparent'
        size='noPadding'
        className='flex min-h-[100px] gap-4 rounded-xl bg-slate-100 px-4 pb-0 pt-4 text-left ring-2 ring-transparent hover:bg-slate-100/80 hover:ring-background-primary focus-visible:bg-slate-100/80 focus-visible:ring-background-primary dark:bg-background-lighter dark:hover:bg-background-lighter/80 dark:focus-visible:bg-background-lighter/80'
        interactive='none'
        onClick={() => setCurrentState('private-key')}
      >
        <GrillKey className='w-16 flex-shrink-0 dark:hidden' />
        <GrillKeyDark className='hidden w-16 flex-shrink-0 dark:block' />
        <div className='mb-4 flex flex-1 items-center gap-4'>
          <div className='flex flex-1 flex-col gap-1.5'>
            <span className='font-semibold'>Grill Key</span>
            <span className='text-sm text-text-muted'>
              View the private key that grants ownership over your account
            </span>
          </div>
          <HiChevronRight className='flex-shrink-0 text-2xl text-text-muted' />
        </div>
      </Button>
      <Button
        variant='transparent'
        size='noPadding'
        className='flex min-h-[100px] items-center gap-4 rounded-xl bg-slate-100 p-4 text-left ring-2 ring-transparent hover:bg-slate-100/80 hover:ring-background-primary focus-visible:bg-slate-100/80 focus-visible:ring-background-primary dark:bg-background-lighter dark:hover:bg-background-lighter/80 dark:focus-visible:bg-background-lighter/80'
        interactive='none'
        onClick={() => setCurrentState('share-session')}
      >
        <ShareSession className='w-16 flex-shrink-0 dark:hidden' />
        <ShareSessionDark className='hidden w-16 flex-shrink-0 dark:block' />
        <div className='flex flex-1 items-center gap-4'>
          <div className='flex flex-1 flex-col gap-1.5'>
            <span className='font-semibold'>Share Session</span>
            <span className='text-sm text-text-muted'>
              Easily log into this account on other devices
            </span>
          </div>
          <HiChevronRight className='flex-shrink-0 text-2xl text-text-muted' />
        </div>
      </Button>
    </div>
  )
}
