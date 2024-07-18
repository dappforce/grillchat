import Button from '@/components/Button'
import CatClicker from '@/components/CatClicker'
import FormatBalance from '@/components/FormatBalance'
import {
  decreaseEnergyValue,
  increasePointsBalance,
} from '@/services/datahub/leaderboard/points-balance/optimistic'
import {
  FULL_ENERGY_VALUE,
  getClickedPointsByDayQuery,
  getEnergyStateQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
import { getActiveStakingTokenomicMetadataQuery } from '@/services/datahub/leaderboard/query'
import { getDayAndWeekTimestamp } from '@/services/datahub/utils'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { useQueryClient } from '@tanstack/react-query'
import { useHapticFeedbackRaw } from '@tma.js/sdk-react'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Link from 'next/link'
import { TouchEvent, TouchList, memo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import {
  getEnergyStateStore,
  getTappedPointsStateStore,
  setEnergyStateToStore,
  setTappedPointsStateToStore,
} from './store'

dayjs.extend(utc)

const likeMemesInfoMessageStorage = new LocalStorage(
  () => 'like-memes-info-message'
)

type PointsClickerProps = {
  className?: string
}

const PointsClicker = ({ className }: PointsClickerProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isTouched, setIsTouched] = useState(false)
  const [touches, setTouches] = useState<TouchList>()
  const haptic = useHapticFeedbackRaw(true)
  const client = useQueryClient()
  const myAddress = useMyMainAddress()
  const sendEvent = useSendEvent()
  const { data, isLoading: isEnergyLoading } = getEnergyStateQuery.useQuery(
    myAddress || ''
  )
  const { data: tokenomicMetadata, isLoading: isTokenomicMetadataLoading } =
    getActiveStakingTokenomicMetadataQuery.useQuery({})
  const { data: clickedPointsByDay, isLoading: isClickedPointsLoading } =
    getClickedPointsByDayQuery.useQuery(myAddress || '')

  const [showMemeMessage, setShowMemeMessage] = useState(false)

  const onShowMemeMessage = () => {
    const messageInfoTimestamp = likeMemesInfoMessageStorage.get() as string
    const { day } = getDayAndWeekTimestamp()

    const isShowedToday = messageInfoTimestamp === day.toString()

    if (!showMemeMessage && !isShowedToday) {
      setTimeout(() => {
        setShowMemeMessage(true)
        sendEvent('tooltip_like_memes_showed')
      }, 5000)
    }
  }

  const [startAnimation, setStartAnimation] = useState(false)

  const { energyValue } = data || {}

  const isEmptyEnergy = energyValue === 0

  const disableClicker =
    isClickedPointsLoading ||
    isTokenomicMetadataLoading ||
    !tokenomicMetadata ||
    isEnergyLoading ||
    (clickedPointsByDay &&
      clickedPointsByDay?.tapsCount >= tokenomicMetadata.maxTapsPerDay) ||
    isEmptyEnergy

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (startAnimation && !isTouched) {
      timeout = setTimeout(() => {
        setStartAnimation(false)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [startAnimation, isTouched])

  useEffect(() => {
    const refCurrent = ref.current
    let ts: number | undefined
    const onTouchStart = (e: any) => {
      ts = e.touches[0].clientY
    }
    const onTouchMove = (e: any) => {
      if (refCurrent) {
        const scroll = refCurrent.scrollTop
        const te = e.changedTouches[0].clientY
        if (scroll <= 0 && ts! < te) {
          e.preventDefault()
        }
      } else {
        e.preventDefault()
      }
    }

    ref.current?.addEventListener('touchstart', onTouchStart, {
      passive: false,
    })
    refCurrent?.addEventListener('touchmove', onTouchMove, {
      passive: false,
    })

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('touchstart', onTouchStart)
        refCurrent.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [])

  const onMouseDown = (event: TouchEvent<HTMLDivElement>) => {
    setStartAnimation(true)
    setIsTouched(true)
    setTouches(event.touches)
  }

  const onMouseUp = () => {
    setIsTouched(false)
    onShowMemeMessage()

    for (let i = 0; i < (touches?.length || 0); i++) {
      const touch = touches?.item(i)

      if (ref.current && touch) {
        const word = document.createElement('div')
        word.classList.add('floating-word')
        word.textContent = '+1'

        const rect = ref.current.getBoundingClientRect()

        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top

        word.style.left = x - 25 + 'px'
        word.style.top = y - 25 + 'px'

        ref.current.appendChild(word)

        if (myAddress && !isEmptyEnergy) {
          increasePointsBalance({
            client,
            address: myAddress,
            pointsByClick: 1,
          })

          decreaseEnergyValue({
            client,
            address: myAddress,
            energyValuePerClick: 1,
          })
          const storedTappedPoints = getTappedPointsStateStore()

          const newTappedPoints = storedTappedPoints?.tappedPoints
            ? parseInt(storedTappedPoints.tappedPoints) + 1
            : 1

          setTappedPointsStateToStore({
            tappedPoints: newTappedPoints.toString(),
          })

          const storedEnergy = getEnergyStateStore()

          const newEnergyValue = storedEnergy?.energyValue
            ? parseInt(storedEnergy.energyValue) - 1
            : FULL_ENERGY_VALUE - 1

          setEnergyStateToStore({
            energyValue: newEnergyValue.toString(),
            timestamp: dayjs().utc().unix().toString(),
          })
        }
        setTimeout(() => {
          ref.current?.removeChild(word)
        }, 3000)
      }
    }

    haptic?.result?.impactOccurred('medium')

    setTouches(undefined)
  }

  return (
    <>
      <div
        ref={ref}
        className={cx('relative flex pl-3', className)}
        onTouchStart={disableClicker ? undefined : onMouseDown}
        onTouchEnd={disableClicker ? undefined : onMouseUp}
      >
        <div
          className={cx(
            'absolute z-0 h-[175px] w-[175px] bg-[#5E81EA] blur-[102px]',
            'bottom-0 left-0 right-0 top-0 m-auto'
          )}
          style={{ transform: 'translate3d(0, 0, 0)' }}
        ></div>
        <CatClicker
          isPaused={!startAnimation || disableClicker}
          style={{
            filter: disableClicker ? 'brightness(0.7) grayscale(0.8)' : '',
            alignSelf: 'center',
          }}
        />
      </div>
      <LikeMemesInfoMessageMemo
        showMemesInfoMessage={showMemeMessage}
        setShowMemesInfoMessage={setShowMemeMessage}
      />
    </>
  )
}

type LikeMemesInfoMessageProps = {
  showMemesInfoMessage: boolean
  setShowMemesInfoMessage: (show: boolean) => void
}

const LikeMemesInfoMessage = ({
  showMemesInfoMessage,
  setShowMemesInfoMessage,
}: LikeMemesInfoMessageProps) => {
  const [domReady, setDomReady] = useState(false)
  const { data: tokenomicMetadata, isLoading: isTokenomicMetadataLoading } =
    getActiveStakingTokenomicMetadataQuery.useQuery({})

  const sendEvent = useSendEvent()

  useEffect(() => {
    setDomReady(true)
  }, [])

  if (!showMemesInfoMessage) return null

  const userLikeWeight =
    tokenomicMetadata?.superLikeWeightPoints &&
    tokenomicMetadata?.likerRewardDistributionPercent
      ? new BN(tokenomicMetadata.superLikeWeightPoints)
          .multipliedBy(
            new BN(tokenomicMetadata.likerRewardDistributionPercent).dividedBy(
              100
            )
          )
          .toString()
      : '0'

  return domReady
    ? createPortal(
        <div className='absolute bottom-0 w-full animate-fade px-2 pb-2'>
          <Link
            href='/tg'
            className='flex items-center gap-[10px] rounded-[20px] bg-slate-800 p-[10px] pr-4'
            onClick={() => {
              const { day } = getDayAndWeekTimestamp()

              likeMemesInfoMessageStorage.set(day.toString())
              sendEvent('tooltip_like_memes_clicked')
            }}
          >
            <span className='text-[40px]'>💡</span>
            <div className='flex flex-col gap-[10px]'>
              <span className='text-base font-bold leading-none'>
                Like memes and earn more
              </span>
              <span
                className={cx(
                  mutedTextColorStyles,
                  'text-sm font-medium leading-none'
                )}
              >
                Each like on a meme brings{' '}
                {
                  <FormatBalance
                    value={userLikeWeight}
                    loading={isTokenomicMetadataLoading}
                  />
                }{' '}
                points
              </span>
            </div>
            <div className='flex min-w-fit flex-1 items-center justify-end'>
              <Button
                className='m-0 justify-self-end p-0 text-2xl text-text-muted'
                variant='transparent'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  const { day } = getDayAndWeekTimestamp()
                  likeMemesInfoMessageStorage.set(day.toString())
                  sendEvent('tooltip_like_memes_closed')
                  setShowMemesInfoMessage(false)
                }}
              >
                <HiXMark />
              </Button>
            </div>
          </Link>
        </div>,
        document.getElementById('tap-page-container')!
      )
    : null
}

const LikeMemesInfoMessageMemo = memo(LikeMemesInfoMessage)

export default PointsClicker
