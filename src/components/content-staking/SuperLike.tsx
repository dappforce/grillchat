import Thumbsup from '@/assets/emojis/thumbsup.png'
import { useIsAddressBlockedInApp } from '@/hooks/useIsAddressBlockedInApp'
import { getPostQuery, getServerTimeQuery } from '@/services/api/query'
import { useCreateSuperLike } from '@/services/datahub/content-staking/mutation'
import {
  PostRewards,
  getAddressLikeCountToPostQuery,
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
import { getIsContestEnded, getIsInContest } from '@/utils/contest'
import { currentNetwork } from '@/utils/network'
import { LocalStorage } from '@/utils/storage'
import dayjs from 'dayjs'
import { verifyMessage } from 'ethers'
import Image from 'next/image'
import { ComponentProps, ReactNode } from 'react'
import { toast } from 'sonner'
import PopOver from '../floating/PopOver'
import { sendEventWithRef } from '../referral/analytics'
import PostRewardStat from './PostRewardStat'

export type SuperLikeProps = ComponentProps<'div'> & {
  withPostReward: boolean
  postId: string
  postRewardClassName?: string
  isMyMessage?: boolean
  showWhenZero?: boolean
  disabled?: boolean
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
    postRewards?: PostRewards | undefined | null
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

  const isInContest = getIsInContest(post?.struct.rootPostId ?? '')
  const isContestEnded = getIsContestEnded()
  const isInEndedContest = isInContest && isContestEnded

  const { canBeLiked: canBeSuperliked, isLoading: loadingCanBeLiked } =
    useClientValidationOfPostSuperLike(post?.struct.createdAtTime ?? 0)

  const myAddress = useMyMainAddress()
  const myGrillAddress = useMyAccount.use.address()

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

  // const entity = post?.struct.isComment ? 'message' : 'post'
  const entity = 'memes'

  const isDisabled =
    (!canBeSuperliked ||
      isMyPost ||
      loadingMyLike ||
      loadingBlocked ||
      loadingTodayCount ||
      loadingCanBeLiked ||
      hasLikedMoreThanLimit ||
      !message ||
      isInEndedContest) &&
    !hasILiked

  let disabledCause = ''
  if (loadingBlocked || loadingTodayCount || loadingCanBeLiked)
    disabledCause = 'Loading...'
  else if (isMyPost) {
    disabledCause = `You cannot like your own ${entity}`
  } else if (hasLikedMoreThanLimit)
    disabledCause = `You've liked 10 ${entity} today. Come back tomorrow for more fun!`
  else if (!canBeSuperliked)
    disabledCause = `You cannot like ${entity}s that are older than 7 days`
  else if (isInEndedContest) disabledCause = `Contest has ended`

  const handleClick = async (e?: React.MouseEvent<HTMLButtonElement>) => {
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
      })}
    </>
  )
}

function animateLike(postId: string) {
  const likeImage = document.getElementById(
    `floating-like-image-${postId}`
  ) as HTMLImageElement

  const container = document.getElementById(
    `floating-like-container-${postId}`
  ) as HTMLDivElement

  if (likeImage) {
    likeImage.classList.add('animate')
    likeImage.addEventListener(
      'animationend',
      () => {
        likeImage?.classList.remove('animate')
      },
      { once: true }
    )
  }
  createFloatingLikes(likeImage, container)
}

function createFloatingLikes(
  likeImage: HTMLImageElement | null,
  container: HTMLDivElement | null
) {
  if (container && likeImage) {
    const numberOfLikes = 5
    for (let i = 0; i < numberOfLikes; i++) {
      setTimeout(() => {
        const like = document.createElement('div')
        like.classList.add('floating-like')
        like.textContent = '👍'

        const minDistance = 20
        const maxDistance = 40

        const angle = i * (180 / numberOfLikes) * (Math.PI / 180)
        const distance =
          Math.random() * (maxDistance - minDistance) + minDistance

        const x = Math.cos(angle) * distance
        const y = -Math.sin(angle) * distance

        like.style.setProperty('--x', `${x}px`)
        like.style.setProperty('--y', `${y}px`)

        container.appendChild(like)

        like.addEventListener(
          'animationend',
          () => {
            like.remove()
          },
          { once: true }
        )
      }, Math.random() * 500)
    }
  }
}

export default function SuperLike({
  postId,
  isMyMessage,
  withPostReward,
  showWhenZero,
  disabled,
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
      }) => {
        if (superLikeCount <= 0 && !showWhenZero) return null
        const button = (
          <SuperLikeButton
            superLikeCount={superLikeCount}
            isMyMessage={isMyMessage}
            hasILiked={hasILiked}
            postId={postId}
            onClick={() => {
              sendEventWithRef(myAddress ?? '', (refId) => {
                sendEvent(
                  'click_superlike',
                  { eventSource: 'message', postId },
                  { ref: refId }
                )
              })
              handleClick()
              if (!hasILiked && !isDisabled) {
                animateLike(postId)
              }
            }}
            style={
              hasILiked
                ? { backgroundPosition: '-1px', backgroundSize: '105%' }
                : {}
            }
            disabled={isDisabled || disabled}
          />
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
                placement='top-start'
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
  const { data: serverTime, isLoading } = getServerTimeQuery.useQuery(null, {
    refetchInterval: CLIENT_CHECK_INTERVAL,
  })

  const isPostMadeMoreThan1WeekAgo =
    dayjs(serverTime).diff(dayjs(createdAtTime), 'day') > 7
  return { canBeLiked: !isPostMadeMoreThan1WeekAgo, isLoading }
}

export type SuperLikeButtonProps = ComponentProps<'button'> & {
  superLikeCount: number
  isMyMessage?: boolean
  hasILiked?: boolean
  postId?: string
}
export function SuperLikeButton({
  superLikeCount,
  isMyMessage,
  hasILiked,
  postId,
  ...props
}: SuperLikeButtonProps) {
  return (
    // To make the post reward stat not jumping when its liked, maybe its a mac issue
    <div
      className='relative min-w-[3.25rem]'
      id={`floating-like-container-${postId}`}
    >
      <button
        {...props}
        className={cx(
          // identifier for toggle chat menu checker in ChatItemMenus
          'superlike',
          'flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-[#EFF4FA] px-3 py-1 text-text-muted transition dark:bg-background-lighter',
          'enabled:hover:border-[#7779F3] enabled:focus-visible:border-[#7779F3]',
          'disabled:!opacity-50',
          isMyMessage &&
            'dark:disabled:!bg-black/20 dark:disabled:!text-white/50',
          hasILiked &&
            '!bg-gradient-to-r from-[#8B55FD] to-[#7493FC] !text-white',
          props.className
        )}
      >
        <Image
          id={`floating-like-image-${postId}`}
          src={Thumbsup}
          alt=''
          className='h-4 w-auto'
        />
        <span className='relative -top-px'>{superLikeCount}</span>
      </button>
    </div>
  )
}
