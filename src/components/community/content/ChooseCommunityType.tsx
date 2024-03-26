import ChatIcon from '@/assets/icons/bubble-chat.svg'
import HubIcon from '@/assets/icons/hub.svg'
import MegaphoneIcon from '@/assets/icons/megaphone.svg'
import ActionCard, { ActionCardProps } from '@/components/ActionCard'
import { useSendEvent } from '@/stores/analytics'
import { useCreateChatModal } from '@/stores/create-chat-modal'

const ChooseCommunityTypeContent = () => {
  const { openModal } = useCreateChatModal()
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

  return <ActionCard className='mt-2' actions={menus} />
}
export default ChooseCommunityTypeContent
