import { useCommitModerationAction } from '@/services/api/moderation/mutation'
import { getBlockedInPostIdDetailedQuery } from '@/services/api/moderation/query'
import { useMyAccount } from '@/stores/my-account'
import { HiXMark } from 'react-icons/hi2'
import AddressAvatar from '../AddressAvatar'
import Button from '../Button'
import DataCard, { DataCardProps } from '../DataCard'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'
import Name from '../Name'

export type ModerationInfoModalProps = ModalFunctionalityProps & {
  chatId: string
  hubId: string
}

export default function ModerationInfoModal({
  chatId,
  hubId,
  ...props
}: ModerationInfoModalProps) {
  const myAddress = useMyAccount((state) => state.address)

  const { data } = getBlockedInPostIdDetailedQuery.useQuery(chatId)
  const blockedUsers = data?.address ?? []
  const blockedUsersCount = blockedUsers.length

  const { mutate } = useCommitModerationAction()

  if (!myAddress) return null

  const unblock = (resourceId: string) => {
    mutate({
      action: 'unblock',
      resourceId,
      address: myAddress,
      ctxPostId: chatId,
      ctxSpaceId: hubId,
    })
  }

  const cardData: DataCardProps['data'] = blockedUsers.map((blockedData) => {
    const address = blockedData.resourceId
    return {
      title: address,
      customContent: (
        <div className='flex items-center gap-2'>
          <AddressAvatar address={address} />
          <div className='flex flex-1 flex-col gap-0.5'>
            <Name address={address} showEthIcon={false} />
            <span className='text-sm text-text-muted'>
              {blockedData.reason.reasonText}
            </span>
          </div>
          <Button
            size='noPadding'
            variant='transparent'
            className='text-2xl'
            onClick={() => unblock(address)}
          >
            <HiXMark />
          </Button>
        </div>
      ),
    }
  })

  return (
    <Modal
      {...props}
      title='🛡 Moderation'
      description='Moderated content will not be deleted from the blockchain but be hidden from the other users in Grill.chat.'
    >
      <div className='flex flex-col gap-2'>
        <span className='text-sm text-text-muted'>
          Blocked users ({blockedUsersCount})
        </span>
        <DataCard data={cardData} />
      </div>
    </Modal>
  )
}
