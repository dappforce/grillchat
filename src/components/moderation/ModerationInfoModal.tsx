import BlockedImage from '@/assets/graphics/blocked.png'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import { GetBlockedInAppDetailedQuery } from '@/old/services/datahub/generated-query'
import { useModerationActions } from '@/old/services/datahub/moderation/mutation'
import {
  getBlockedInAppDetailedQuery,
  getBlockedInPostIdDetailedQuery,
} from '@/old/services/datahub/moderation/query'
import { getPostQuery } from '@/services/api/query'
import { useMyMainAddress } from '@/stores/my-account'
import { getTimeRelativeToNow } from '@/utils/date'
import Image from 'next/image'
import { useReducer } from 'react'
import { toast } from 'react-hot-toast'
import { HiOutlineInformationCircle, HiXMark } from 'react-icons/hi2'
import AddressAvatar from '../AddressAvatar'
import Button from '../Button'
import DataCard, { DataCardProps } from '../DataCard'
import Name, { useName } from '../Name'
import { Skeleton } from '../SkeletonFallback'
import Toast from '../Toast'
import ConfirmationModal from '../modals/ConfirmationModal'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'

export type ModerationInfoModalProps = ModalFunctionalityProps & {
  chatId: string
  hubId: string
}

type ConfirmationModalState = {
  isOpenConfirmation: boolean
  toBeUnblocked: {
    id: string
    reasonText: string
    blockedTime: string
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

  const { isAdmin } = useAuthorizedForModeration(chatId)

  const { data: chat } = getPostQuery.useQuery(chatId)
  const chatEntityId = chat?.entityId ?? ''

  const { data: blockedInPost, isLoading: isLoadingBlockedInPost } =
    getBlockedInPostIdDetailedQuery.useQuery(chatEntityId, {
      enabled: props.isOpen,
    })
  const { data: blockedInApp, isLoading: isLoadingBlockedInApp } =
    getBlockedInAppDetailedQuery.useQuery(null)

  const { name } = useName(toBeUnblocked?.id ?? '')
  const { mutateAsync } = useModerationActions({
    onSuccess: (_, variables) => {
      if (variables.callName === 'synth_moderation_unblock_resource') {
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

  const cardMapper = (
    blockedData: GetBlockedInAppDetailedQuery['moderationBlockedResourcesDetailed'][number],
    isAppBlockedData?: boolean
  ) => {
    const address = blockedData.resourceId
    const reasonText = blockedData.reason.reasonText
    const unblockFunc = () =>
      dispatch({
        type: 'open',
        payload: {
          id: address,
          reasonText,
          blockedTime: blockedData.createdAt,
        },
      })
    return {
      title: address,
      customContent: (
        <DataCardContent
          address={address}
          reasonText={reasonText}
          blockedTime={blockedData.createdAt}
          onUnblock={
            (isAppBlockedData && isAdmin) || (!isAppBlockedData && !isAdmin)
              ? unblockFunc
              : undefined
          }
        />
      ),
    }
  }

  const blockedInPostCardData: DataCardProps['data'] = (
    blockedInPost?.address ?? []
  ).map((data) => cardMapper(data))
  const blockedInAppCardData: DataCardProps['data'] = (
    blockedInApp?.address ?? []
  ).map((data) => cardMapper(data, true))

  const unblock = async () => {
    if (!toBeUnblocked) return
    await mutateAsync({
      callName: 'synth_moderation_unblock_resource',
      args: {
        resourceId: toBeUnblocked.id,
        ctxPostIds: ['*'],
        ctxAppIds: ['*'],
      },
    })
  }
  const hasAnyBlockedInApp = isAdmin && blockedInAppCardData.length

  return (
    <>
      <Modal
        {...props}
        isOpen={props.isOpen && !isOpenConfirmation}
        title='🛡 Moderation'
        description='Moderated content will not be deleted from the blockchain but be hidden from the other users in Grill.'
      >
        <div className='flex flex-col gap-4'>
          {hasAnyBlockedInApp && (
            <BlockedUsersList
              data={blockedInAppCardData}
              isLoading={isLoadingBlockedInApp}
              title='Blocked users in whole Grill'
            />
          )}
          <BlockedUsersList
            showNoDataImage={!hasAnyBlockedInApp}
            data={blockedInPostCardData}
            isLoading={isLoadingBlockedInPost}
            title='Blocked users'
          />
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
                      blockedTime={toBeUnblocked.blockedTime}
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

function BlockedUsersList({
  data,
  isLoading,
  title,
  showNoDataImage,
}: {
  title: string
  data: DataCardProps['data']
  isLoading: boolean
  showNoDataImage?: boolean
}) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm text-text-muted'>
        {title} ({data.length})
      </span>
      {isLoading ? (
        <Skeleton className='h-40 w-full rounded-2xl' />
      ) : (
        <div className='overflow-hidden rounded-2xl bg-background-lighter px-4 pr-1'>
          {data.length ? (
            <DataCard
              className='max-h-96 overflow-y-scroll rounded-none p-0 py-4 pr-1 scrollbar-track-background-lighter scrollbar-thumb-background-lightest/70'
              data={data}
            />
          ) : (
            <div className='flex flex-col items-center gap-4 py-4 text-center'>
              {showNoDataImage && <Image src={BlockedImage} alt='' />}
              <span className='text-text-muted'>
                There&apos;re no blocked users yet.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DataCardContent({
  address,
  reasonText,
  onUnblock,
  blockedTime,
}: {
  address: string
  reasonText: string
  blockedTime?: string
  onUnblock?: () => void
}) {
  return (
    <div className='flex items-center gap-2'>
      <AddressAvatar address={address} />
      <div className='flex w-full flex-1 flex-col gap-0.5'>
        <Name showModeratorChip address={address} />
        <div className='flex items-end gap-2'>
          <span className='text-sm text-text-muted'>
            {reasonText}, blocked {getTimeRelativeToNow(blockedTime as string)}
          </span>
        </div>
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
