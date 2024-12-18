import { getPostQuery } from '@/services/api/query'
import { getModeratorQuery } from '@/services/datahub/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'
import useIsModerationAdmin from './useIsModerationAdmin'

export default function useAuthorizedForModeration(
  chatId: string,
  address?: string
) {
  const myAddress = useMyMainAddress()
  const usedAddress = address ?? myAddress
  const { data: chat } = getPostQuery.useQuery(chatId)

  const isOwner = chat?.struct.ownerId === usedAddress
  const { data: moderator, isLoading } = getModeratorQuery.useQuery(
    usedAddress ?? ''
  )

  const isAdmin = useIsModerationAdmin(address)

  return {
    isAuthorized: !!(
      moderator?.address &&
      (moderator.postIds?.includes(chatId) ||
        moderator.postIds.includes(chat?.entityId ?? '') ||
        isAdmin)
    ),
    isOwner,
    isLoading,
    moderatorData: moderator,
    isAdmin,
  }
}
