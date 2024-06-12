import Diamond from '@/assets/emojis/diamond.png'
import { getUserYesterdayRewardQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import { formatNumber } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { HiXMark } from 'react-icons/hi2'
import urlJoin from 'url-join'
import Button from '../Button'
import Card from '../Card'
import { isWelcomeModalOpenStorage } from './WelcomeModal'

const progressModalStorage = {
  getIsClosed: () => {
    const today = dayjs.utc().startOf('day').unix()
    const closedTimestamp = localStorage.getItem('progress-modal-closed')
    if (!closedTimestamp) return false
    return today === Number(closedTimestamp)
  },
  close: () => {
    const today = dayjs.utc().startOf('day').unix()
    localStorage.setItem('progress-modal-closed', String(today))
  },
}

export default function RewardPerDayModal() {
  const sendEvent = useSendEvent()
  const [isOpen, setIsOpen] = useState(false)
  const myAddress = useMyMainAddress()
  const { data } = getUserYesterdayRewardQuery.useQuery({
    address: myAddress ?? '',
  })
  const hasEarnedAnything = !!(
    Number(data?.earned.creator ?? '0') || Number(data?.earned.staker ?? '0')
  )

  useEffect(() => {
    const shouldOpen =
      !progressModalStorage.getIsClosed() &&
      !!myAddress &&
      hasEarnedAnything &&
      isWelcomeModalOpenStorage.get() !== 'true'
    if (shouldOpen) {
      sendEvent('open_progress_modal')
    }
    setIsOpen(shouldOpen)
  }, [myAddress, sendEvent, hasEarnedAnything])

  const stakerReward = Number(data?.earned.staker ?? '0')
  const creatorReward = Number(data?.earned.creator ?? '0')

  const twitterShareText = `💰 Turn your love of memes into rewards! 
Epic lets you earn tokens simply by liking and posting memes. 

Sounds too good to be true? Join me and see for yourself! 😉`

  const closeDrawer = () => {
    setIsOpen(false)
    progressModalStorage.close()
  }

  useHotkeys('esc', closeDrawer)

  return createPortal(
    <>
      <Transition
        show={isOpen}
        appear
        className='fixed inset-0 z-40 h-full w-full bg-black/50 backdrop-blur-md transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
        onClick={closeDrawer}
      />
      <Transition
        show={isOpen}
        appear
        className='fixed bottom-0 left-1/2 z-40 mx-auto flex h-auto w-full max-w-screen-md -translate-x-1/2 rounded-t-[10px] bg-background-light outline-none transition duration-300'
        enterFrom={cx('opacity-0 translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 translate-y-24 !duration-150'
      >
        <Button
          size='circleSm'
          variant='transparent'
          className='absolute right-4 top-4'
          onClick={closeDrawer}
        >
          <HiXMark className='text-lg' />
        </Button>
        <div className='mx-auto flex w-full max-w-screen-md flex-col gap-6 overflow-auto px-5 py-6 pb-12'>
          <div className='flex flex-col gap-2'>
            <span className='text-2xl font-medium'>
              Your progress yesterday
            </span>
            <span className='text-text-muted'>
              Your engagement on the platform is producing results! Great job!
            </span>
          </div>
          <div className='flex w-full flex-col gap-4'>
            <Card className='flex flex-col gap-2 p-4'>
              <div className='mr-3 flex gap-2'>
                <Image src={Diamond} alt='' className='h-10 w-10' />
                <span className='flex items-center text-3xl font-bold'>
                  {formatNumber(stakerReward, { shorten: true })}
                </span>
              </div>
              <span className='text-sm font-medium text-text-muted'>
                Points for liking memes
              </span>
            </Card>
            {!!creatorReward && (
              <Card className='flex flex-col gap-2 p-4'>
                <div className='mr-3 flex gap-2'>
                  <Image src={Diamond} alt='' className='h-10 w-10' />
                  <span className='flex items-center text-3xl font-bold'>
                    {formatNumber(creatorReward, { shorten: true })}
                  </span>
                </div>
                <span className='text-sm font-medium text-text-muted'>
                  Points for receiving likes for your memes
                </span>
              </Card>
            )}
          </div>
          <div className='grid w-full grid-cols-2 gap-4'>
            <Button
              variant='primaryOutline'
              size='lg'
              onClick={() => {
                openNewWindow(
                  twitterShareUrl(
                    urlJoin(getCurrentUrlOrigin(), '/tg', `?ref=${myAddress}`),
                    twitterShareText,
                    {
                      tags: [
                        'meme2earn',
                        'tap2earn',
                        'memecoins',
                        'memetokens',
                      ],
                    }
                  )
                )
                sendEvent('progress_modal_share_clicked')
              }}
            >
              Share on X
            </Button>
            <Button
              size='lg'
              onClick={() => {
                sendEvent('progress_modal_got_it_clicked')
                setIsOpen(false)
                progressModalStorage.close()
              }}
            >
              Got it!
            </Button>
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}
