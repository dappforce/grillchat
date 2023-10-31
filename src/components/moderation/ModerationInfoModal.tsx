import BlockedImage from '@/assets/graphics/blocked.png'
import { useCommitModerationAction } from '@/services/api/moderation/mutation'
import { getBlockedInPostIdDetailedQuery } from '@/services/api/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'
import Image from 'next/image'
import { useReducer } from 'react'
import { toast } from 'react-hot-toast'
import { HiOutlineInformationCircle, HiXMark } from 'react-icons/hi2'
import AddressAvatar from '../AddressAvatar'
import Button from '../Button'
import DataCard, { DataCardProps } from '../DataCard'
import ConfirmationModal from '../modals/ConfirmationModal'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'
import Name, { useName } from '../Name'
import Toast from '../Toast'

export type ModerationInfoModalProps = ModalFunctionalityProps & {
  chatId: string
  hubId: string
}

type ConfirmationModalState = {
  isOpenConfirmation: boolean
  toBeUnblocked: {
    id: string
    reasonText: string
  } | null
}
type ConfirmationModalAction =
  | {
      type: 'open'
      payload: ConfirmationModalState['toBeUnblocked']
    }
  | { type: 'close' }

export default function ModerationInfoModal({
  chatId,
  hubId,
  ...props
}: ModerationInfoModalProps) {
  const myAddress = useMyMainAddress()
  const [{ isOpenConfirmation, toBeUnblocked }, dispatch] = useReducer(
    (state: ConfirmationModalState, action: ConfirmationModalAction) => {
      switch (action.type) {
        case 'open':
          return {
            isOpenConfirmation: true,
            toBeUnblocked: action.payload,
          }
        case 'close':
          return {
            ...state,
            isOpenConfirmation: false,
          }
      }
    },
    {
      isOpenConfirmation: false,
      toBeUnblocked: null,
    }
  )

  const { data } = getBlockedInPostIdDetailedQuery.useQuery(chatId, {
    enabled: props.isOpen,
  })
  const blockedUsers = data?.address ?? []
  const blockedUsersCount = blockedUsers.length

  const { name } = useName(toBeUnblocked?.id ?? '')
  const { mutate } = useCommitModerationAction({
    onSuccess: (_, variables) => {
      if (variables.action === 'unblock') {
        toast.custom((t) => (
          <Toast
            icon={(classNames) => (
              <HiOutlineInformationCircle className={classNames} />
            )}
            t={t}
            title={`You have unblocked the user ${name}`}
          />
        ))
      }
    },
  })

  if (!myAddress) return null

  const cardData: DataCardProps['data'] = blockedUsers.map((blockedData) => {
    const address = blockedData.resourceId
    const reasonText = blockedData.reason.reasonText
    return {
      title: address,
      customContent: (
        <DataCardContent
          address={address}
          reasonText={reasonText}
          onUnblock={() =>
            dispatch({
              type: 'open',
              payload: {
                id: address,
                reasonText,
              },
            })
          }
        />
      ),
    }
  })

  const unblock = () => {
    if (!toBeUnblocked) return
    mutate({
      action: 'unblock',
      resourceId: toBeUnblocked.id,
      address: myAddress,
      ctxPostId: chatId,
    })
  }

  return (
    <>
      <Modal
        {...props}
        isOpen={props.isOpen && !isOpenConfirmation}
        title='🛡 Moderation'
        description='Moderated content will not be deleted from the blockchain but be hidden from the other users in Grill.chat.'
      >
        <div className='flex flex-col gap-2'>
          <span className='text-sm text-text-muted'>
            Blocked users ({blockedUsersCount})
          </span>
          <div className='overflow-hidden rounded-2xl bg-background-lighter px-4 pr-1'>
            {blockedUsersCount ? (
              <DataCard
                className='max-h-96 overflow-y-scroll rounded-none p-0 py-4 pr-1 scrollbar-track-background-lighter scrollbar-thumb-background-lightest/70'
                data={cardData}
              />
            ) : (
              <div className='flex flex-col items-center gap-4 py-4 text-center'>
                <Image src={BlockedImage} alt='' />
                <span className='text-text-muted'>
                  There&apos;re no blocked users yet.
                </span>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={isOpenConfirmation}
        closeModal={() => dispatch({ type: 'close' })}
        title='🤔 Unblock user'
        primaryButtonProps={{ children: 'Yes, unblock', onClick: unblock }}
        secondaryButtonProps={{ children: 'No, keep blocked' }}
        content={() => {
          if (!toBeUnblocked) return null
          return (
            <DataCard
              data={[
                {
                  title: toBeUnblocked?.id,
                  customContent: (
                    <DataCardContent
                      address={toBeUnblocked.id}
                      reasonText={toBeUnblocked.reasonText}
                    />
                  ),
                },
              ]}
            />
          )
        }}
      />
    </>
  )
}

function DataCardContent({
  address,
  reasonText,
  onUnblock,
}: {
  address: string
  reasonText: string
  onUnblock?: () => void
}) {
  return (
    <div className='flex items-center gap-2'>
      <AddressAvatar address={address} />
      <div className='flex flex-1 flex-col gap-0.5'>
        <Name address={address} showProfileSourceIcon={false} />
        <span className='text-sm text-text-muted'>{reasonText}</span>
      </div>
      {onUnblock && (
        <Button
          size='noPadding'
          variant='transparent'
          className='text-2xl'
          onClick={onUnblock}
        >
          <HiXMark />
        </Button>
      )}
    </div>
  )
}
