import LoadingContent from '@/components/community/content/LoadingContent'
import UpsertChatForm from '@/components/community/content/UpsertChatForm'
import { communityHubId } from '@/modules/chat/HomePage'
import { getProfileQuery } from '@/old/services/api/query'
import { useMyMainAddress } from '@/stores/my-account'
import { ProfileModalContentProps } from '../types'

export const CreateChatContent = ({
  setCurrentState,
}: ProfileModalContentProps) => {
  const myAddress = useMyMainAddress() || ''

  const { data: profile } = getProfileQuery.useQuery(myAddress)

  const hubId = profile?.profileSpace?.id

  return (
    <UpsertChatForm
      hubId={hubId ? hubId : communityHubId}
      customModalStates={{
        onLoading: () => setCurrentState('create-chat-loading'),
      }}
    />
  )
}

export const CreateChatLoadingContent = (_props: ProfileModalContentProps) => {
  return <LoadingContent />
}
