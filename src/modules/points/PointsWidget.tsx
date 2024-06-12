import Diamond from '@/assets/emojis/diamond.png'
import Laugh from '@/assets/emojis/laugh.png'
import Pointup from '@/assets/emojis/pointup.png'
import Speaker from '@/assets/emojis/speaker.png'
import Thumbsup from '@/assets/emojis/thumbsup.png'
import Button from '@/components/Button'
import Card from '@/components/Card'
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

export default function PointsWidget(
  props: ComponentProps<'div'> & { isNoTgScroll?: boolean }
) {
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
            <Points shorten />
          </span>
          <FaChevronDown className='relative top-0.5' />
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
        className='fixed inset-0 z-10 h-full w-full bg-black/50 backdrop-blur-md transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
      />
      <Transition
        appear
        show={isOpen}
        className='fixed inset-0 z-10 h-full w-full pb-20 transition duration-300'
        enterFrom={cx('opacity-0 -translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 -translate-y-24 !duration-150'
      >
        <Button
          className='absolute right-4 top-4'
          variant='transparent'
          size='circleSm'
          onClick={() => setIsOpen(false)}
        >
          <HiXMark className='text-3xl' />
        </Button>
        <div className='mx-auto flex h-full w-full max-w-screen-md flex-col items-center overflow-auto px-4 pt-24'>
          <div className='mb-16 flex flex-col gap-2'>
            <div className='mr-3 flex items-center justify-center gap-3'>
              <Image src={Diamond} alt='' className='h-14 w-14' />
              <span className='flex items-center text-4xl font-bold'>
                <Points />
              </span>
            </div>
            <div className='flex justify-center'>
              <Button
                href='/guide'
                className='bg-[#6395FD]/10 px-5 py-2 text-text'
              >
                How it works
              </Button>
            </div>
          </div>
          <div className='flex w-full flex-1 flex-col gap-4 pb-8'>
            <span className='text-center text-lg font-bold text-text-muted'>
              How to earn Points:
            </span>
            <LinkWrapper close={() => setIsOpen(false)} href='/tg/memes'>
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
            </LinkWrapper>
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

function LikeCount({ shorten }: { shorten?: boolean }) {
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

  return <span>{formatNumber(data?.count ?? '0', { shorten })}</span>
}

function Points({ shorten }: { shorten?: boolean }) {
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
