import Button, { ButtonProps } from '@/components/Button'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import { getPostQuery, getProfileQuery } from '@/services/api/query'
import { useSendEvent } from '@/stores/analytics'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { getCreatorChatIdFromProfile } from '@/utils/chat'
import { communityHubId } from './HomePage'

const CreateChatButton = () => {
  const { openModal } = useCreateChatModal()
  const sendEvent = useSendEvent()
  const myAddress = useMyMainAddress()

  const { data: profile } = getProfileQuery.useQuery(myAddress || '')

  const chatId = getCreatorChatIdFromProfile(profile)

  const { data: chat } = getPostQuery.useQuery(chatId || '', {
    showHiddenPost: { type: 'all' },
  })

  console.log('Chat id and chat struct', chatId, chat)

  const commonProps: Partial<ButtonProps> = {
    size: 'xs',
    variant: 'primary',
    className: 'flex items-center gap-2',
  }

  return chat ? (
    <Button href={`/${profile?.profileSpace?.id}/${chat.id}`} {...commonProps}>
      Creator Chat
    </Button>
  ) : (
    <>
      <Button
        {...commonProps}
        onClick={() => {
          openModal({
            defaultOpenState: profile?.profileSpace?.id
              ? 'create-chat'
              : 'new-comunity',
            onBackClick: undefined,
          })
          sendEvent('create_chat_clicked', {
            eventSource: 'home',
          })
        }}
      >
        Create Chat
      </Button>
      <NewCommunityModal
        hubId={profile?.profileSpace?.id || communityHubId}
        withBackButton={false}
      />
    </>
  )
}

export default CreateChatButton
