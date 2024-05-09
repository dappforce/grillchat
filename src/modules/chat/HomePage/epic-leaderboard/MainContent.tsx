import EpicTokenIllust from '@/assets/graphics/epic-token-illust.svg'

import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import Card, { CardProps } from '@/components/Card'
import Name from '@/components/Name'
import { Skeleton } from '@/components/SkeletonFallback'
import PopOver from '@/components/floating/PopOver'
import { spaceMono } from '@/fonts'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import LeaderboardSection from './LeaderboardSection'

export default function MainContent() {
  return (
    <div className='flex flex-col gap-4 pt-4'>
      <MainCard />
      <Card className='flex flex-col gap-1 bg-background-light'>
        <div className='mb-1 flex items-center gap-2'>
          <span className='font-semibold'>Earn With Friends</span>
          <HiOutlineInformationCircle className='text-text-muted' />
        </div>
        <p className='text-sm text-text-muted'>
          Earn points when your friends join Epic using your link.
        </p>
      </Card>
      <LeaderboardSection />
    </div>
  )
}

function MainCard() {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const address = useMyMainAddress()

  if (!isInitializedProxy) {
    return (
      <MainCardTemplate>
        <div className='flex w-full gap-4'>
          <Skeleton className='hidden h-28 w-28 rounded-lg border-[3px] border-white/20 bg-white/40 object-cover @lg:block' />
          <div className='flex flex-1 flex-col gap-1'>
            <div className='mb-2 flex items-center gap-3 @lg:mb-0'>
              <Skeleton className='h-9 w-9 rounded-lg border-[3px] border-white/20 object-cover @lg:hidden' />
              <Skeleton className='w-36 bg-white/40 text-lg font-semibold' />
            </div>
            <Skeleton className='relative flex h-auto flex-1 flex-col gap-1 rounded-xl bg-white/40 py-3' />
          </div>
        </div>
      </MainCardTemplate>
    )
  }

  if (!address) {
    return <GuestCard />
  }

  return <ProfileCardNew />
}

const ProfileCardNew = () => {
  const myAddress = useMyMainAddress()

  return (
    <MainCardTemplate>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <AddressAvatar
              address={myAddress || ''}
              className='h-[33px] w-[33px] rounded-lg object-cover outline outline-[3px] outline-white/20'
            />
            <Name
              address={myAddress || ''}
              className='text-lg font-semibold !text-white'
            />
          </div>
          <Button variant='transparent' className='bg-white/10'>
            How does it work?
          </Button>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='relative flex flex-col gap-2 rounded-xl'>
            <span
              className={cx(
                'font-mono text-[26px] font-bold leading-none',
                spaceMono.className
              )}
            >
              10,000 Points
            </span>
            <span className='text-sm leading-none text-slate-200'>
              earned this week
            </span>
          </div>
          <PopOver
            yOffset={6}
            panelSize='sm'
            placement='top'
            triggerClassName='w-fit'
            triggerOnHover
            trigger={
              <div className='flex items-start gap-2 md:items-center '>
                <span className='text-sm leading-[22px] text-slate-200'>
                  Distribution in{' '}
                  <span className='font-bold text-white'>7 days</span>
                </span>
                <span className='mt-[4px] md:mt-0'>
                  <HiOutlineInformationCircle className={cx('h-4 w-4')} />
                </span>
              </div>
            }
          >
            <p>Some text</p>
          </PopOver>
        </div>
      </div>
    </MainCardTemplate>
  )
}

function GuestCard() {
  return (
    <MainCardTemplate className='pt-3' illustClassName='-bottom-1/3'>
      <div className='mb-2 flex w-full items-center justify-between'>
        <span className='text-lg font-semibold'>Meme2earn</span>
        <Button variant='transparent' className='bg-white/10'>
          How does it work?
        </Button>
      </div>
      <p className='mb-4 max-w-96 text-white/80'>
        Start monetizing your best memes, and earn when you like posts from
        others!
      </p>
      <Button variant='white'>Start earning</Button>
    </MainCardTemplate>
  )
}

function MainCardTemplate({
  illustClassName,
  ...props
}: CardProps & { illustClassName?: string }) {
  return (
    <Card
      {...props}
      className={cx(
        'relative flex flex-col items-start overflow-clip bg-background-primary text-white @container',
        props.className
      )}
      style={{
        backgroundImage:
          'linear-gradient(93deg, #8056E4 30.82%, #5B3EA6 100.41%)',
        ...props.style,
      }}
    >
      <div
        className={cx(
          'pointer-events-none absolute -bottom-1/4 right-0 h-full w-[125%] translate-x-[40%] @lg:-bottom-1/3',
          illustClassName
        )}
      >
        <EpicTokenIllust />
      </div>

      <div className='relative z-10 flex w-full flex-1 flex-col items-start'>
        {props.children}
      </div>
    </Card>
  )
}