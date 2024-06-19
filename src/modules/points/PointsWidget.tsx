import Diamond from '@/assets/emojis/diamond.png'
import Laugh from '@/assets/emojis/laugh.png'
import Pointup from '@/assets/emojis/pointup.png'
import Speaker from '@/assets/emojis/speaker.png'
import Thumbsup from '@/assets/emojis/thumbsup.png'
import BlueGradient from '@/assets/graphics/blue-gradient.png'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import { Skeleton } from '@/components/SkeletonFallback'
import useIsMounted from '@/hooks/useIsMounted'
import { getTodaySuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { getBalanceQuery } from '@/services/datahub/leaderboard/points-balance/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import { allowWindowScroll, preventWindowScroll } from '@/utils/window'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { FaChevronDown } from 'react-icons/fa'
import { HiChevronRight, HiXMark } from 'react-icons/hi2'
import SlotCounter from 'react-slot-counter'

export default function PointsWidget({
  withPointsAnimation = true,
  ...props
}: ComponentProps<'div'> & {
  isNoTgScroll?: boolean
  withPointsAnimation?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isMounted = useIsMounted()
  const sendEvent = useSendEvent()

  useHotkeys('esc', () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  useEffect(() => {
    if (!props.isNoTgScroll) {
      if (isOpen) preventWindowScroll()
      else allowWindowScroll()
    }
  }, [props.isNoTgScroll, isOpen])

  return (
    <>
      <div
        {...props}
        className={cx(
          'z-10 flex w-full cursor-pointer items-center justify-between rounded-b-2xl bg-black/50 px-4.5 py-3 backdrop-blur-xl',
          props.className
        )}
        onClick={() => {
          setIsOpen(true)
          sendEvent('widget_expanded')
        }}
      >
        <div className='flex items-center gap-2'>
          <Image className='h-6 w-6' src={Thumbsup} alt='' />
          <span className='text-xl font-bold'>
            <LikeCount />
            /10
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Image className='h-7 w-7' src={Diamond} alt='' />
          <span className='flex items-center text-xl font-bold'>
            <Points withPointsAnimation={withPointsAnimation} />
          </span>
          <FaChevronDown className='relative' />
        </div>
      </div>
      {isMounted && (
        <PointsDrawerContent isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </>
  )
}

function PointsDrawerContent({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  return createPortal(
    <>
      <Transition
        appear
        show={isOpen}
        className='fixed inset-0 z-10 h-full w-full bg-background transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
      />
      <Transition
        appear
        show={isOpen}
        className='fixed inset-0 z-10 flex h-full w-full flex-col bg-background pb-20 transition duration-300'
        enterFrom={cx('opacity-0 -translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 -translate-y-24 !duration-150'
      >
        <div className='mx-auto flex w-full max-w-screen-md flex-1 flex-col overflow-auto'>
          <Image
            src={BlueGradient}
            alt=''
            className='absolute left-1/2 top-0 w-full -translate-x-1/2'
          />
          <div className='relative mx-auto flex w-full items-center justify-between px-4 py-4'>
            <span className='text-xl font-bold'>My Progress</span>
            <Button
              className='-mr-2'
              variant='transparent'
              size='circleSm'
              onClick={() => setIsOpen(false)}
            >
              <HiXMark className='text-3xl' />
            </Button>
          </div>
          <div className='relative mx-auto flex h-full w-full flex-col items-center px-4 pt-12'>
            <div className='mb-14 grid w-full grid-cols-2 gap-3'>
              <div className='flex flex-col gap-2'>
                <span className='text-center text-text-muted'>
                  LIKES LEFT TODAY:
                </span>
                <div className='flex items-center justify-center gap-3'>
                  <Image src={Thumbsup} alt='' className='h-8 w-8' />
                  <span className='text-2xl font-bold'>
                    <LikeCount />
                    /10
                  </span>
                </div>
                <div className='flex justify-center'>
                  <LinkText href='/guide' variant='primary'>
                    How it works?
                  </LinkText>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-center text-text-muted'>
                  POINTS EARNED:
                </span>
                <div className='mr-1 flex items-center justify-center gap-3'>
                  <Image src={Diamond} alt='' className='-mr-1.5 h-8 w-8' />
                  <span className='flex h-8 items-center text-2xl font-bold'>
                    <Points />
                  </span>
                </div>
                <div className='flex justify-center'>
                  <LinkText href='/guide' variant='primary'>
                    How it works?
                  </LinkText>
                </div>
              </div>
            </div>
            <div className='flex w-full flex-1 flex-col gap-4 pb-8'>
              <span className='text-center text-lg font-bold text-text-muted'>
                How to earn Points:
              </span>
              <LinkWrapper close={() => setIsOpen(false)} href='/tg/memes'>
                <Card className='flex w-full items-center gap-4 bg-background-light'>
                  <Image
                    src={Laugh}
                    alt=''
                    className='h-14 w-14 flex-shrink-0'
                  />
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
              </LinkWrapper>
              <LinkWrapper close={() => setIsOpen(false)} href='/tg/friends'>
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
              </LinkWrapper>
              <LinkWrapper close={() => setIsOpen(false)} href='/tg'>
                <Card className='flex w-full items-center gap-4 bg-background-light'>
                  <Image
                    src={Pointup}
                    alt=''
                    className='h-14 w-14 flex-shrink-0'
                  />
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg font-bold'>Tap2Earn</span>
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
              </LinkWrapper>
            </div>
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}

function LinkWrapper({
  href,
  children,
  close,
}: {
  href: string
  children: React.ReactNode
  close: () => void
}) {
  const router = useRouter()

  const link = (
    <Link
      href={href}
      className='rounded-2xl outline-none ring-2 ring-transparent ring-offset-0 ring-offset-transparent transition focus-within:ring-background-lightest hover:ring-background-lightest'
    >
      {children}
    </Link>
  )

  if (router.pathname === href) {
    return <span onClick={close}>{link}</span>
  }
  return link
}

const MAX_LIKES_PER_DAY = 10

function LikeCount() {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  const { data, isLoading } = getTodaySuperLikeCountQuery.useQuery(
    myAddress ?? ''
  )

  if ((isLoading && myAddress) || !isInitializedProxy) {
    return (
      <Skeleton className='relative -top-0.5 inline-block w-12 align-middle' />
    )
  }

  return <span>{MAX_LIKES_PER_DAY - (data?.count ?? 0)}</span>
}

function Points({
  shorten,
  withPointsAnimation = true,
}: {
  shorten?: boolean
  withPointsAnimation?: boolean
}) {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  const { data, isLoading } = getBalanceQuery.useQuery(myAddress || '')

  const formatted = formatNumber(data ?? '0', { shorten })
  const splitValues = useMemo(() => {
    return formatted.split('')
  }, [formatted])

  if ((isLoading && myAddress) || !isInitializedProxy) {
    return <Skeleton className='inline-block w-12' />
  }

  if (!withPointsAnimation) return <span>{splitValues}</span>

  return (
    <SlotCounter
      containerClassName='relative -top-0.5'
      value={splitValues}
      animateOnVisible={false}
      sequentialAnimationMode
      startValue={splitValues}
      startValueOnce
    />
  )
}
