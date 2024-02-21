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
import { useLoginModal } from '@/stores/login-modal'
import { useGetCurrentSigner, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import { LocalStorage } from '@/utils/storage'
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
  }) => ReactNode
}) {
  const [openModalState, setOpenModalState] = useState<
    'should-stake' | 'confirmation' | ''
  >('')
  const { data: postRewards } = getPostRewardsQuery.useQuery(postId, {
    enabled: withPostReward,
  })
  const { setIsOpen } = useLoginModal()

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
  const { data: totalStake, isFetching: loadingTotalStake } =
    getTotalStakeQuery.useQuery(myAddress ?? '')
  const { data: myLike, isFetching: loadingMyLike } =
    getAddressLikeCountToPostQuery.useQuery({
      address: myAddress ?? '',
      postId: postId,
    })

  const handleClick = (e?: SyntheticEvent) => {
    e?.stopPropagation()
    if (hasILiked) return
    if (!myAddress) {
      setIsOpen(true)
      return
    }
    if (!totalStake?.hasStakedEnough) {
      setOpenModalState('should-stake')
      return
    }

    const sig = currentWeekSigStorage.get()
    if (!sig || !message) {
      setOpenModalState('confirmation')
      return
    }
    const result = signatureVerify(message, sig, myAddress)
    if (!result.isValid) {
      currentWeekSigStorage.remove()
      setOpenModalState('confirmation')
      return
    }
    createSuperLike({ postId, confirmation: { msg: message, sig } })
  }

  const hasILiked = (myLike?.count ?? 0) > 0
  const isMyPost = post?.struct.ownerId === myAddress

  const canBeSuperliked = clientCanPostSuperLiked && canPostSuperLiked
  const entity = post?.struct.isComment ? 'comment' : 'post'

  const isDisabled =
    (!canBeSuperliked ||
      isMyPost ||
      loadingMyLike ||
      loadingTotalStake ||
      !message) &&
    !hasILiked

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
              hasILiked && 'bg-background-primary text-white'
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
            {postRewards?.isNotZero && <PostRewardStat postId={postId} />}
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
