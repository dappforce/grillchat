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
  getConfirmationMsgQuery,
  getPostRewardsQuery,
  getSuperLikeCountQuery,
  getTotalStakeQuery,
} from '@/services/datahub/content-staking/query'
import { useChatMenu } from '@/stores/chat-menu'
import { useLoginModal } from '@/stores/login-modal'
import {
  useGetCurrentSigner,
  useMyAccount,
  useMyMainAddress,
} from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import { LocalStorage } from '@/utils/storage'
import { u8aToHex } from '@polkadot/util'
import { signatureVerify } from '@polkadot/util-crypto'
import dayjs from 'dayjs'
import Image from 'next/image'
import {
  ComponentProps,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'
import Toast from '../Toast'
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
  const [openModalState, setOpenModalState] = useState<
    'should-stake' | 'confirmation' | ''
  >('')
  const { data: postRewards } = getPostRewardsQuery.useQuery(postId, {
    enabled: withPostReward,
  })
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

  const handleClick = (e?: SyntheticEvent) => {
    // prevent chat menu from opening when clicking this button
    if (!isMenuOpened) e?.stopPropagation()

    if (hasILiked || !message) return
    if (!myAddress || !myGrillAddress) {
      setIsOpen(true)
      return
    }
    if (!totalStake?.hasStakedEnough) {
      setOpenModalState('should-stake')
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
      !message) &&
    !hasILiked

  let disabledCause = ''
  if (post?.struct.dataType === 'offChain')
    disabledCause = `This ${entity} is not monetized.${
      isMyPost
        ? ` You can monetize this ${entity} by resending your message`
        : ''
    }`
  else if (isMyPost) disabledCause = `You cannot like your own ${entity}`
  else if (!isExist)
    disabledCause = `This ${entity} is still being minted, please wait a few seconds`
  else if (!validByCreatorMinStake)
    disabledCause = `This ${entity} cannot be liked because its author has not yet locked at least 2,000 SUB`
  else if (!canBeSuperliked)
    disabledCause = `You cannot like ${entity}s that are older than 7 days`
  else if (isOffchainPost)
    disabledCause = `You cannot like off-chain ${entity}s`

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
      <ShouldStakeModal
        closeModal={() => setOpenModalState('')}
        isOpen={openModalState === 'should-stake'}
      />
      <ApproveContentStakingModal
        postId={postId}
        closeModal={() => setOpenModalState('')}
        isOpen={openModalState === 'confirmation'}
      />
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
function ApproveContentStakingModal({
  postId,
  ...props
}: ModalFunctionalityProps & { postId: string }) {
  const myAddress = useMyMainAddress()
  const [isSigning, setIsSigning] = useState(false)
  const getSigner = useGetCurrentSigner()
  const { mutate: createSuperLike } = useCreateSuperLike()
  const { data: message } = getConfirmationMsgQuery.useQuery(undefined)

  return (
    <Modal
      {...props}
      title='Join a new week of Content Staking!'
      description='By confirming, you agree to participate in the Content Staking Program this week, where you may get SUB tokens, NFTs, or other tokens, based on your active engagement.'
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
          disabled={!message}
          isLoading={isSigning}
          size='lg'
          onClick={async () => {
            setIsSigning(true)
            try {
              const signer = await getSigner()
              if (signer && myAddress) {
                const signature = await signer.signRaw({
                  address: myAddress,
                  data: message!,
                })
                currentWeekSigStorage.set(signature)
                if (!message) throw new Error('No message to sign')
                createSuperLike({
                  postId,
                  confirmation: { msg: message, sig: signature },
                })
              }
            } catch (err) {
              toast.custom((t) => (
                <Toast
                  t={t}
                  title='Failed to sign the message'
                  description={
                    (err as any)?.message ||
                    'Please try to refresh or relogin to your account'
                  }
                />
              ))
            } finally {
              setIsSigning(false)
              props.closeModal()
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
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
