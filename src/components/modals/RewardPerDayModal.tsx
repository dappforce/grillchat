import Diamond from '@/assets/emojis/diamond.png'
import { getUserYesterdayRewardQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import { formatNumber } from '@/utils/strings'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { Drawer } from 'vaul'
import Button from '../Button'
import Card from '../Card'
import { getReferralLink } from '../referral/utils'
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

export default function ProgressModal() {
  const sendEvent = useSendEvent()
  const [isOpen, setIsOpen] = useState(false)
  const myAddress = useMyMainAddress()
  const { data } = getUserYesterdayRewardQuery.useQuery({
    address: myAddress ?? '',
  })
  const hasEarnedAnything =
    Number(data?.earned.creator ?? '0') || Number(data?.earned.staker ?? '0')

  useEffect(() => {
    const shouldOpen =
      !progressModalStorage.getIsClosed() &&
      !!myAddress &&
      hasEarnedAnything &&
      isWelcomeModalOpenStorage.get() !== 'true'
    if (shouldOpen) {
      sendEvent('open_progress_modal')
    }
    setIsOpen(!progressModalStorage.getIsClosed() && !!myAddress)
  }, [myAddress, sendEvent, hasEarnedAnything])

  if (!isOpen) return null

  const stakerReward = Number(data?.earned.staker ?? '0')
  const creatorReward = Number(data?.earned.creator ?? '0')

  return (
    <Drawer.Root
      shouldScaleBackground
      direction='bottom'
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        progressModalStorage.close()
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 z-40 h-full w-full bg-black/50 backdrop-blur-lg' />
        <Drawer.Content className='fixed inset-x-0 bottom-0 z-40 mx-auto flex h-auto w-full max-w-screen-md flex-col rounded-t-[10px] bg-background-light outline-none'>
          <Drawer.Close className='absolute right-4 top-4'>
            <HiXMark className='text-lg' />
          </Drawer.Close>
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
                    {formatNumber(stakerReward)}
                  </span>
                </div>
                <span className='text-sm font-medium text-text-muted'>
                  Points for liking memes
                </span>
              </Card>
              {creatorReward && (
                <Card className='flex flex-col gap-2 p-4'>
                  <div className='mr-3 flex gap-2'>
                    <Image src={Diamond} alt='' className='h-10 w-10' />
                    <span className='flex items-center text-3xl font-bold'>
                      {formatNumber(creatorReward)}
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
                    twitterShareUrl(getReferralLink(myAddress), '', {
                      tags: ['meme2earn', 'memetoken'],
                    })
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
                }}
              >
                Got it!
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
