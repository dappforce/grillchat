import SubsocialTokenImage from '@/assets/graphics/subsocial-tokens-large.png'
import Button from '@/components/Button'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { CONTENT_STAKING_LINK } from '@/constants/links'
import { getPostQuery } from '@/services/api/query'
import { useCreateSuperLike } from '@/services/datahub/content-staking/mutation'
import {
  PostRewards,
  getAddressLikeCountToPostQuery,
  getCanPostSuperLikedQuery,
  getPostRewardsQuery,
  getSuperLikeCountQuery,
  getTotalStakeQuery,
} from '@/services/datahub/content-staking/query'
import { useLoginModal } from '@/stores/login-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import dayjs from 'dayjs'
import Image from 'next/image'
import {
  ComponentProps,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'
import PopOver from '../floating/PopOver'
import PostRewardStat from './PostRewardStat'

export type SuperLikeProps = ComponentProps<'div'> & {
  withPostReward: boolean
  messageId: string
}

export function SuperLikeWrapper({
  messageId,
  children,
  withPostReward,
}: {
  messageId: string
  withPostReward: boolean
  children: (props: {
    hasILiked: boolean
    isDisabled: boolean
    disabledCause: string
    superLikeCount: number
    handleClick: () => void
    postRewards: PostRewards | undefined | null
  }) => ReactNode
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { data: postRewards } = getPostRewardsQuery.useQuery(messageId, {
    enabled: withPostReward,
  })
  const { setIsOpen } = useLoginModal()

  const { data: message } = getPostQuery.useQuery(messageId)
  const { mutate: createSuperLike } = useCreateSuperLike()
  const { data: superLikeCount } = getSuperLikeCountQuery.useQuery(messageId)

  const clientCanPostSuperLiked = useClientValidationOfPostSuperLike(
    message?.struct.createdAtTime ?? 0
  )
  const { data: canPostSuperLike } =
    getCanPostSuperLikedQuery.useQuery(messageId)
  const { canPostSuperLiked, isExist, validByCreatorMinStake } =
    canPostSuperLike || {}

  const myAddress = useMyMainAddress()
  const { data: totalStake, isFetching: loadingTotalStake } =
    getTotalStakeQuery.useQuery(myAddress ?? '')
  const { data: myLike, isFetching: loadingMyLike } =
    getAddressLikeCountToPostQuery.useQuery({
      address: myAddress ?? '',
      postId: messageId,
    })

  const handleClick = (e?: SyntheticEvent) => {
    e?.stopPropagation()
    if (hasILiked) return
    if (!myAddress) {
      setIsOpen(true)
      return
    }
    if (!totalStake?.hasStakedEnough) {
      setIsOpenModal(true)
      return
    }
    createSuperLike({ postId: messageId })
  }

  const hasILiked = (myLike?.count ?? 0) > 0
  const isMyPost = message?.struct.ownerId === myAddress

  const canBeSuperliked = clientCanPostSuperLiked && canPostSuperLiked
  const entity = message?.struct.isComment ? 'comment' : 'post'

  const isDisabled =
    !canBeSuperliked || isMyPost || loadingMyLike || loadingTotalStake
  let disabledCause = ''
  if (isMyPost) disabledCause = `You cannot like your own ${entity}`
  else if (!isExist)
    disabledCause = `This ${entity} is still being minted, please wait a few seconds`
  else if (!validByCreatorMinStake)
    disabledCause = `This ${entity} cannot be liked because its author has not yet locked at least 2,000 SUB`
  else if (!canBeSuperliked)
    disabledCause = `You cannot like ${entity}s that are older than 7 days`

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
      <ShouldStakeModal
        closeModal={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
    </>
  )
}

export default function SuperLike({
  messageId,
  withPostReward,
  ...props
}: SuperLikeProps) {
  return (
    <SuperLikeWrapper messageId={messageId} withPostReward={withPostReward}>
      {({
        handleClick,
        isDisabled,
        disabledCause,
        hasILiked,
        superLikeCount,
        postRewards,
      }) => {
        if (superLikeCount <= 0) return null
        const button = (
          <button
            onClick={handleClick}
            disabled={isDisabled}
            className={cx(
              'flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-background-lighter px-2 py-0.5 text-text-primary transition-colors',
              'enabled:hover:border-background-primary enabled:hover:text-text enabled:focus-visible:border-background-primary',
              'disabled:bg-border-gray/50 disabled:text-text-muted',
              hasILiked && 'bg-background-primary text-text'
            )}
          >
            {hasILiked ? <IoDiamond /> : <IoDiamondOutline />}
            <span>{superLikeCount}</span>
          </button>
        )
        return (
          <div
            {...props}
            className={cx('flex items-center gap-3', props.className)}
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
            {postRewards?.isNotZero && <PostRewardStat postId={messageId} />}
          </div>
        )
      }}
    </SuperLikeWrapper>
  )
}

function ShouldStakeModal({ ...props }: ModalFunctionalityProps) {
  return (
    <Modal
      {...props}
      title='Wait a sec...'
      description='In this app, every like is more than just a thumbs-up! When you like a post, both you and the author can earn extra SUB tokens. For this, you need to start locking SUB tokens first.'
      withCloseButton
    >
      <div className='flex flex-col items-center gap-6'>
        <Image
          src={SubsocialTokenImage}
          alt='subsocial'
          className='w-100'
          style={{ maxWidth: '250px' }}
        />
        <Button
          className='w-full'
          size='lg'
          href={CONTENT_STAKING_LINK}
          target='_blank'
          rel='noopener noreferrer'
        >
          Start Locking SUB
        </Button>
      </div>
    </Modal>
  )
}

function useClientValidationOfPostSuperLike(createdAtTime: number) {
  const [, setState] = useState({})

  useEffect(() => {
    const interval = setInterval(() => setState({}), 5 * 1000 * 60) // refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const isPostMadeMoreThan1WeekAgo =
    dayjs().diff(dayjs(createdAtTime), 'day') > 7
  return !isPostMadeMoreThan1WeekAgo
}
