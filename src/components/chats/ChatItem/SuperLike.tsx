import SubsocialTokenImage from '@/assets/graphics/subsocial-tokens-large.png'
import Button, { ButtonProps } from '@/components/Button'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { CONTENT_STAKING_LINK } from '@/constants/links'
import { useCreateSuperLike } from '@/services/datahub/content-staking/mutation'
import {
  getAddressLikeCountToPostQuery,
  getSuperLikeCountQuery,
  getTotalStakeQuery,
} from '@/services/datahub/content-staking/query'
import { useLoginModal } from '@/stores/login-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'

export type SuperLikeProps = ButtonProps & {
  messageId: string
}

export function SuperLikeWrapper({
  messageId,
  children,
}: {
  messageId: string
  children: (props: {
    hasILiked: boolean
    disabled: boolean
    superLikeCount: number
    handleClick: () => void
  }) => ReactNode
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { setIsOpen } = useLoginModal()

  const { mutate: createSuperLike } = useCreateSuperLike()
  const { data: superLikeCount } = getSuperLikeCountQuery.useQuery(messageId)

  const myAddress = useMyMainAddress()
  const { data: totalStake, isFetching: loadingTotalStake } =
    getTotalStakeQuery.useQuery(myAddress ?? '')
  const { data: myLike, isFetching: loadingMyLike } =
    getAddressLikeCountToPostQuery.useQuery({
      address: myAddress ?? '',
      postId: messageId,
    })

  const hasILiked = (myLike?.count ?? 0) > 0
  const disabled = loadingMyLike || loadingTotalStake

  const handleClick = () => {
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

  return (
    <>
      {children({
        disabled,
        handleClick,
        hasILiked,
        superLikeCount: superLikeCount?.count ?? 0,
      })}
      <ShouldStakeModal
        closeModal={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      />
    </>
  )
}

export default function SuperLike({ messageId, ...props }: SuperLikeProps) {
  return (
    <SuperLikeWrapper messageId={messageId}>
      {({ handleClick, disabled, hasILiked, superLikeCount }) =>
        superLikeCount > 0 && (
          <button
            {...props}
            onClick={handleClick}
            disabled={disabled}
            className={cx(
              'flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-background-lighter px-2 py-0.5 text-text-primary transition-colors',
              'hover:border-background-primary hover:text-text focus-visible:border-background-primary',
              'disabled:bg-border-gray/50 disabled:text-text-muted',
              hasILiked && 'bg-background-primary text-text',
              props.className
            )}
          >
            {hasILiked ? (
              <IoDiamond className='relative top-px' />
            ) : (
              <IoDiamondOutline className='relative top-px' />
            )}
            <span>{superLikeCount}</span>
          </button>
        )
      }
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
