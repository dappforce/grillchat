import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import Card, { CardProps } from '@/components/Card'
import FormatBalance from '@/components/FormatBalance'
import Name from '@/components/Name'
import { Skeleton } from '@/components/SkeletonFallback'
import PopOver from '@/components/floating/PopOver'
import { spaceMono } from '@/fonts'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import epicConfig from '../../../../constants/config/epic'
import MissingRewards from '../MissingRewards'
import LeaderboardSection from './LeaderboardSection'
import ReferralSection from './ReferralSection'
import useCalculateTokenRewards from './useCalculateTokenRewards'

const { gradient, tokenSymbol, EpicTokenIllust } = epicConfig

type MainContentProps = {
  className?: string
  address?: string
}

const MainContent = ({ className, address }: MainContentProps) => {
  const myAddress = useMyMainAddress()

  return (
    <div
      className={cx(
        'overflow-auto pb-4 max-lg:h-[calc(100dvh-8.2rem)] lg:h-[calc(100dvh-4rem)]',
        className
      )}
    >
      <div className={cx('flex flex-col gap-4 px-4 pt-4 lg:px-0')}>
        <MainCard address={address} />
        <MissingRewards address={address} />
        {myAddress && myAddress === address && <ReferralSection />}
        <LeaderboardSection />
      </div>
    </div>
  )
}

function MainCard({ address }: MainContentProps) {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()

  const userAddress = address || myAddress

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

  if (!userAddress) {
    return <GuestCard />
  }

  return <ProfileCard address={address} />
}

const ProfileCard = ({ address }: MainContentProps) => {
  const myAddress = useMyMainAddress()

  const userAddress = address || myAddress || ''

  const { isLoading, data: reward } = useCalculateTokenRewards(userAddress)

  return (
    <MainCardTemplate>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <AddressAvatar
              address={userAddress || ''}
              className='h-[33px] w-[33px] rounded-lg object-cover outline outline-[3px] outline-white/20'
            />
            <Name
              address={userAddress || ''}
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
              <FormatBalance
                value={reward}
                symbol={`$${tokenSymbol}`}
                loading={isLoading}
              />
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
  const setIsLoginModalOpen = useLoginModal.use.setIsOpen()

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
      <Button variant='white' onClick={() => setIsLoginModalOpen(true)}>
        Start earning
      </Button>
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
        backgroundImage: gradient,
        ...props.style,
      }}
    >
      <EpicTokenIllust
        className={cx(
          'absolute -bottom-[54px] -right-[306px]',
          illustClassName
        )}
      />
      <div className='relative z-10 flex w-full flex-1 flex-col items-start'>
        {props.children}
      </div>
    </Card>
  )
}

export default MainContent
