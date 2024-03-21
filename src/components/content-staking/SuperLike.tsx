import { env } from '@/env.mjs'
import { useIsAddressBlockedInApp } from '@/hooks/useIsAddressBlockedInApp'
import { getPostQuery } from '@/services/api/query'
import { useCreateSuperLike } from '@/services/datahub/content-staking/mutation'
import {
  PostRewards,
  getAddressLikeCountToPostQuery,
  getCanPostSuperLikedQuery,
  getConfirmationMsgQuery,
  getPostRewardsQuery,
  getSuperLikeCountQuery,
  getTotalStakeQuery,
} from '@/services/datahub/content-staking/query'
import { useChatMenu } from '@/stores/chat-menu'
import { useLoginModal } from '@/stores/login-modal'
import { useMessageData } from '@/stores/message'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import { LocalStorage } from '@/utils/storage'
import { u8aToHex } from '@polkadot/util'
import { signatureVerify } from '@polkadot/util-crypto'
import dayjs from 'dayjs'
import {
  ComponentProps,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'
import PopOver from '../floating/PopOver'
import PostRewardStat from './PostRewardStat'

export type SuperLikeProps = ComponentProps<'div'> & {
  withPostReward: boolean
  postId: string
  postRewardClassName?: string
  isMyMessage?: boolean
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
    isOffchainPost?: boolean
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
  const { data: canPostSuperLike } = getCanPostSuperLikedQuery.useQuery(postId)
  const { canPostSuperLiked, isExist, validByCreatorMinStake } =
    canPostSuperLike || {}

  const myAddress = useMyMainAddress()
  const myGrillAddress = useMyAccount.use.address()

  const { data: totalStake, isFetching: loadingTotalStake } =
    getTotalStakeQuery.useQuery(myAddress ?? '')
  const { data: myLike, isFetching: loadingMyLike } =
    getAddressLikeCountToPostQuery.useQuery({
      address: myAddress ?? '',
      postId: postId,
    })

  const hasILiked = (myLike?.count ?? 0) > 0
  const isMyPost = post?.struct.ownerId === myAddress

  const canBeSuperliked = clientCanPostSuperLiked && canPostSuperLiked
  const entity = post?.struct.isComment ? 'message' : 'post'
  const isOffchainPost = post?.struct.dataType === 'offChain'

  const isDisabled =
    (!canBeSuperliked ||
      isMyPost ||
      loadingMyLike ||
      loadingTotalStake ||
      loadingBlocked ||
      !message) &&
    !hasILiked

  let disabledCause = ''
  if (isMyPost) {
    const isOffchainPostInUsualHub =
      isOffchainPost &&
      !env.NEXT_PUBLIC_OFFCHAIN_POSTING_HUBS.includes(post.struct.spaceId ?? '')
    if (isOffchainPostInUsualHub) {
      disabledCause = `Your ${entity} is not monetized, because its not sent to blockchain, you can resend it to make it monetized`
    } else {
      disabledCause = `You cannot like your own ${entity}`
    }
  } else if (isOffchainPost)
    disabledCause = `You cannot like off-chain ${entity}s`
  else if (!isExist)
    disabledCause = `This ${entity} is still being minted, please wait a few seconds`
  else if (!validByCreatorMinStake)
    disabledCause = `This ${entity} cannot be liked because its author has not yet locked at least 2,000 SUB`
  else if (!canBeSuperliked)
    disabledCause = `You cannot like ${entity}s that are older than 7 days`

  const handleClick = (e?: SyntheticEvent) => {
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
    if (!totalStake?.hasStakedEnough) {
      setOpenMessageModal('should-stake')
      return
    }

    let sig = currentWeekSigStorage.get()
    if (!sig) {
      const signer = useMyAccount.getState().signer
      if (signer && myGrillAddress) {
        sig = u8aToHex(signer.sign?.(message))
        currentWeekSigStorage.set(sig)
      } else {
        toast.error('No signer provided')
        return
      }
    }
    const result = signatureVerify(message, sig, myGrillAddress)
    if (!result.isValid) {
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
        isOffchainPost,
      })}
    </>
  )
}

export default function SuperLike({
  postId,
  isMyMessage,
  withPostReward,
  ...props
}: SuperLikeProps) {
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
        isOffchainPost,
      }) => {
        if (superLikeCount <= 0 || isOffchainPost) return null
        const button = (
          <button
            onClick={handleClick}
            disabled={isDisabled}
            className={cx(
              'flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-[#EFF4FA] px-2 py-0.5 text-[#7779F3] transition dark:bg-background-lighter',
              'enabled:hover:border-[#7779F3] enabled:focus-visible:border-[#7779F3]',
              'disabled:!bg-border-gray/50 disabled:!text-text-muted',
              isMyMessage &&
                'dark:disabled:!bg-black/20 dark:disabled:!text-white/50',
              hasILiked &&
                '!bg-gradient-to-r from-[#8B55FD] to-[#7493FC] !text-white'
            )}
          >
            {hasILiked ? <IoDiamond /> : <IoDiamondOutline />}
            <span>{superLikeCount}</span>
          </button>
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
                <p>{disabledCause}</p>
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
