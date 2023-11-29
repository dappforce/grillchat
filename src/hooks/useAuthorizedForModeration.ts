import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import { getPostQuery } from '@/services/api/query'
import { getModeratorQuery } from '@/services/subsocial/datahub/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'

export default function useAuthorizedForModeration(chatId: string) {
  const myAddress = useMyMainAddress()
  const { data: chat } = getPostQuery.useQuery(chatId)

  const isOwner = chat?.struct.ownerId === myAddress
  const { data: moderator, isLoading } = getModeratorQuery.useQuery(
    myAddress ?? '',
    {
      enabled: !!myAddress,
    }
  )

  if (!COMMUNITY_CHAT_HUB_ID || !isOwner)
    return { isAuthorized: false, isOwner }
  return {
    isAuthorized: !!(moderator?.address && moderator.postIds?.includes(chatId)),
    isOwner,
    isLoading,
    isModeratorExist: !!moderator?.exist,
  }
}
