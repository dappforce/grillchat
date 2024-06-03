import Thumbsup from '@/assets/emojis/thumbsup.png'
import { useIsAddressBlockedInApp } from '@/hooks/useIsAddressBlockedInApp'
import { getPostQuery } from '@/services/api/query'
import { getIsActiveStakerQuery } from '@/services/datahub/balances/query'
import { useCreateSuperLike } from '@/services/datahub/content-staking/mutation'
import {
  PostRewards,
  getAddressLikeCountToPostQuery,
  getCanPostSuperLikedQuery,
  getConfirmationMsgQuery,
  getPostRewardsQuery,
  getSuperLikeCountQuery,
  getTodaySuperLikeCountQuery,
} from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useChatMenu } from '@/stores/chat-menu'
import { useLoginModal } from '@/stores/login-modal'
import { useMessageData } from '@/stores/message'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import { LocalStorage } from '@/utils/storage'
import dayjs from 'dayjs'
import { verifyMessage } from 'ethers'
import Image from 'next/image'
import {
  ComponentProps,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import Spinner from '../Spinner'
import PopOver from '../floating/PopOver'
import { sendEventWithRef } from '../referral/analytics'
import PostRewardStat from './PostRewardStat'

export type SuperLikeProps = ComponentProps<'div'> & {
  withPostReward: boolean
  postId: string
  postRewardClassName?: string
  isMyMessage?: boolean
  showWhenZero?: boolean
}

export function SuperLikeWrapper({
  postId,
  children,
  withPostReward,
}: {
  postId: string
  withPostReward: boolean
  children: (props: {
    hasILiked: boolean
    isDisabled: boolean
    disabledCause: string
    superLikeCount: number
    handleClick: () => void
    postRewards: PostRewards | undefined | null
    isFetchingActiveStaker: boolean
  }) => ReactNode
}) {
  const setOpenMessageModal = useMessageData.use.setOpenMessageModal()
  const { data: postRewards } = getPostRewardsQuery.useQuery(postId, {
    enabled: withPostReward,
  })

  const { isBlocked, isLoading: loadingBlocked } = useIsAddressBlockedInApp()
  const { setIsOpen } = useLoginModal()
  const isMenuOpened = useChatMenu((state) => state.openedChatId === postId)

  const { data: message } = getConfirmationMsgQuery.useQuery(undefined)
  const { data: post } = getPostQuery.useQuery(postId)
  const { mutate: createSuperLike } = useCreateSuperLike()
  const { data: superLikeCount } = getSuperLikeCountQuery.useQuery(postId)

  const clientCanPostSuperLiked = useClientValidationOfPostSuperLike(
    post?.struct.createdAtTime ?? 0
  )
  const { data: canPostSuperLike, isLoading: loadingCanPostSuperLiked } =
    getCanPostSuperLikedQuery.useQuery(postId)
  const { canPostSuperLiked, isExist, validByCreatorMinStake } =
    canPostSuperLike || {}

  const myAddress = useMyMainAddress()
  const myGrillAddress = useMyAccount.use.address()
  const {
    data: isActiveStaker,
    isLoading: loadingActiveStakerRaw,
    isFetching: isFetchingActiveStaker,
    refetch,
  } = getIsActiveStakerQuery.useQuery(myAddress ?? '')
  const isLoadingActiveStaker = loadingActiveStakerRaw && !!myAddress

  const { data: todaySuperLikeCount, isLoading: loadingTodayCountRaw } =
    getTodaySuperLikeCountQuery.useQuery(myAddress ?? '')
  const loadingTodayCount = loadingTodayCountRaw && !!myAddress
  const hasLikedMoreThanLimit = (todaySuperLikeCount?.count ?? 0) >= 10

  const { data: myLike, isFetching: loadingMyLike } =
    getAddressLikeCountToPostQuery.useQuery({
      address: myAddress ?? '',
      postId: postId,
    })

  const hasILiked = (myLike?.count ?? 0) > 0
  const isMyPost = post?.struct.ownerId === myAddress

  const canBeSuperliked = clientCanPostSuperLiked && canPostSuperLiked
  // const entity = post?.struct.isComment ? 'message' : 'post'
  const entity = 'memes'

  const isDisabled =
    (!canBeSuperliked ||
      isMyPost ||
      loadingMyLike ||
      loadingBlocked ||
      loadingTodayCount ||
      loadingCanPostSuperLiked ||
      isLoadingActiveStaker ||
      hasLikedMoreThanLimit ||
      !message) &&
    !hasILiked

  let disabledCause = ''
  if (
    isLoadingActiveStaker ||
    loadingBlocked ||
    loadingTodayCount ||
    loadingCanPostSuperLiked
  )
    disabledCause = 'Loading...'
  else if (isMyPost) {
    disabledCause = `You cannot like your own ${entity}`
  } else if (hasLikedMoreThanLimit)
    disabledCause = `You've liked 10 ${entity} today. Come back tomorrow for more fun!`
  else if (!isExist)
    disabledCause = `This ${entity} is still being minted, please wait a few seconds`
  else if (!validByCreatorMinStake)
    disabledCause = `This ${entity} cannot be liked because its author has not yet locked at least 2,000 SUB`
  else if (!canBeSuperliked)
    disabledCause = `You cannot like ${entity}s that are older than 7 days`

  const handleClick = async (e?: SyntheticEvent) => {
    // prevent chat menu from opening when clicking this button
    if (!isMenuOpened) e?.stopPropagation()

    if (hasILiked || !message || isDisabled) return

    if (isBlocked) {
      setOpenMessageModal('blocked')
      return
    }

    if (!myAddress || !myGrillAddress) {
      setIsOpen(true)
      return
    }

    if (!isActiveStaker) {
      const res = await refetch()
      if (!res.data) {
        setOpenMessageModal('should-stake')
        return
      }
    }

    let sig = currentWeekSigStorage.get()
    if (!sig) {
      const signer = useMyAccount.getState().signer
      if (signer && myGrillAddress) {
        sig = await signer.signMessage?.(message)
        currentWeekSigStorage.set(sig)
      } else {
        toast.error('No signer provided')
        return
      }
    }
    const result = verifyMessage(message, sig)
    if (result !== myGrillAddress) {
      currentWeekSigStorage.remove()
      handleClick()
      return
    }
    createSuperLike({ postId, confirmation: { msg: message, sig } })
  }

  return (
    <>
      {children({
        isDisabled,
        disabledCause,
        handleClick,
        hasILiked,
        superLikeCount: superLikeCount?.count ?? 0,
        postRewards,
        isFetchingActiveStaker,
      })}
    </>
  )
}

export default function SuperLike({
  postId,
  isMyMessage,
  withPostReward,
  showWhenZero,
  ...props
}: SuperLikeProps) {
  const myAddress = useMyMainAddress()
  const sendEvent = useSendEvent()
  if (currentNetwork !== 'subsocial') return null

  return (
    <SuperLikeWrapper postId={postId} withPostReward={withPostReward}>
      {({
        handleClick,
        isDisabled,
        disabledCause,
        hasILiked,
        superLikeCount,
        postRewards,
        isFetchingActiveStaker,
      }) => {
        if (superLikeCount <= 0 && !showWhenZero) return null
        const button = (
          // To make the post reward stat not jumping when its liked, maybe its a mac issue
          <div className='min-w-[3.25rem]'>
            <button
              onClick={() => {
                sendEventWithRef(myAddress ?? '', (refId) => {
                  sendEvent(
                    'click_superlike',
                    { eventSource: 'message', postId },
                    { ref: refId }
                  )
                })
                handleClick()
              }}
              disabled={isDisabled}
              className={cx(
                // identifier for toggle chat menu checker in ChatItemMenus
                'superlike',
                'flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-[#EFF4FA] px-2 py-0.5 text-text-muted transition dark:bg-background-lighter',
                'enabled:hover:border-[#7779F3] enabled:focus-visible:border-[#7779F3]',
                'disabled:!opacity-50',
                isMyMessage &&
                  'dark:disabled:!bg-black/20 dark:disabled:!text-white/50',
                hasILiked &&
                  '!bg-gradient-to-r from-[#8B55FD] to-[#7493FC] !text-white'
              )}
            >
              {isFetchingActiveStaker ? (
                <Spinner className='h-4 w-4' />
              ) : (
                <Image src={Thumbsup} alt='' className='h-4 w-auto' />
              )}
              <span className='relative -top-px'>{superLikeCount}</span>
            </button>
          </div>
        )
        return (
          <div
            {...props}
            className={cx('flex items-center gap-3 text-sm', props.className)}
          >
            {disabledCause ? (
              <PopOver
                yOffset={6}
                panelSize='sm'
                placement='top'
                triggerOnHover
                trigger={button}
              >
                <p className='max-w-32 text-center'>{disabledCause}</p>
              </PopOver>
            ) : (
              button
            )}
            {postRewards?.isNotZero && (
              <PostRewardStat
                className={cx(
                  isMyMessage && 'text-text-muted-on-primary-light'
                )}
                postId={postId}
              />
            )}
          </div>
        )
      }}
    </SuperLikeWrapper>
  )
}

const currentWeekSigStorage = new LocalStorage(() => 'df.current-week-sig')

const CLIENT_CHECK_INTERVAL = 5 * 1000 * 60 // 5 minutes
function useClientValidationOfPostSuperLike(createdAtTime: number) {
  const [, setState] = useState({})

  useEffect(() => {
    const interval = setInterval(() => setState({}), CLIENT_CHECK_INTERVAL) // refresh every interval
    return () => clearInterval(interval)
  }, [])

  const isPostMadeMoreThan1WeekAgo =
    dayjs().diff(dayjs(createdAtTime), 'day') > 7
  return !isPostMadeMoreThan1WeekAgo
}
