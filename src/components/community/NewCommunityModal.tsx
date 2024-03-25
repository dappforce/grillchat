import ChatIcon from '@/assets/icons/bubble-chat.svg'
import HubIcon from '@/assets/icons/hub.svg'
import MegaphoneIcon from '@/assets/icons/megaphone.svg'
import ActionCard, { ActionCardProps } from '@/components/ActionCard'
import Modal from '@/components/modals/Modal'
import { useSendEvent } from '@/stores/analytics'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import UpsertChatModal from './UpsertChatModal'

export type NewCommunityModalProps = {
  hubId: string
  withBackButton?: boolean
}

export default function NewCommunityModal({
  hubId,
  withBackButton = true,
}: NewCommunityModalProps) {
  const { openModal, isOpen, defaultOpenState, closeModal } =
    useCreateChatModal()
  const sendEvent = useSendEvent()

  const menus: ActionCardProps['actions'] = [
    {
      text: 'Group Chat',
      description: 'Anyone can participate in a public conversation',
      icon: ChatIcon,
      firstVisitNotificationStorageName: 'new-community-chat',
      onClick: () => {
        openModal({ defaultOpenState: 'create-chat' })
        sendEvent('open_chat_creation_form')
      },
    },
    {
      text: 'Channel',
      description: 'Only you can post updates and others can comment on them',
      icon: MegaphoneIcon,
      isComingSoon: true,
    },
    {
      text: 'Hub',
      description: 'A collection of related chats or channels',
      icon: HubIcon,
      isComingSoon: true,
    },
  ]

  return (
    <>
      <Modal
        isOpen={isOpen && defaultOpenState === 'new-comunity'}
        title='💭 New Community'
        withCloseButton
        closeModal={closeModal}
      >
        <ActionCard className='mt-2' actions={menus} />
      </Modal>
      <UpsertChatModal
        isOpen={defaultOpenState === 'create-chat'}
        closeModal={() => closeModal()}
        onBackClick={
          withBackButton
            ? () => openModal({ defaultOpenState: 'new-comunity' })
            : undefined
        }
        formProps={{
          hubId,
          onTxSuccess: closeModal,
        }}
      />
    </>
  )
}
