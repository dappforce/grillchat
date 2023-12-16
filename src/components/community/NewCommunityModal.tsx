import ChatIcon from '@/assets/icons/bubble-chat.svg'
import HubIcon from '@/assets/icons/hub.svg'
import MegaphoneIcon from '@/assets/icons/megaphone.svg'
import ActionCard, { ActionCardProps } from '@/components/ActionCard'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useSendEvent } from '@/stores/analytics'
import { useState } from 'react'
import UpsertChatModal from './UpsertChatModal'

export type NewCommunityModalProps = ModalFunctionalityProps & {
  hubId: string
}

export default function NewCommunityModal({
  hubId,
  ...props
}: NewCommunityModalProps) {
  const [openedModalState, setOpenedModalState] = useState<null | 'channel'>(
    null
  )
  const sendEvent = useSendEvent()

  const menus: ActionCardProps['actions'] = [
    {
      text: 'Group Chat',
      description: 'Anyone can participate in a public conversation',
      icon: ChatIcon,
      firstVisitNotificationStorageName: 'new-community-chat',
      onClick: () => {
        setOpenedModalState('chat')
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
        {...props}
        isOpen={props.isOpen && openedModalState === null}
        title='💭 New Community'
        withCloseButton
      >
        <ActionCard className='mt-2' actions={menus} />
      </Modal>
      <UpsertChatModal
        isOpen={openedModalState === 'chat'}
        closeModal={() => setOpenedModalState(null)}
        onBackClick={() => setOpenedModalState(null)}
        formProps={{
          hubId,
          onTxSuccess: props.closeModal,
        }}
      />
    </>
  )
}
