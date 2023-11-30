import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import { getPostQuery } from '@/services/api/query'
import { getModeratorQuery } from '@/services/datahub/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'

export default function useAuthorizedForModeration(
  chatId: string,
  address?: string
) {
  const myAddress = useMyMainAddress()
  const usedAddress = address ?? myAddress
  const { data: chat } = getPostQuery.useQuery(chatId)

  const isOwner = chat?.struct.ownerId === usedAddress
  const { data: moderator, isLoading } = getModeratorQuery.useQuery(
    usedAddress ?? '',
    {
      enabled: !!usedAddress,
    }
  )

  if (!COMMUNITY_CHAT_HUB_ID) return { isAuthorized: false, isOwner }
  return {
    isAuthorized: !!(
      moderator?.address &&
      (moderator.postIds?.includes(chatId) ||
        moderator.postIds.includes(chat?.entityId ?? ''))
    ),
    isOwner,
    isLoading,
    isModeratorExist: !!moderator?.exist,
  }
}
