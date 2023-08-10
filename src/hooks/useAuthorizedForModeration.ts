import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import { getModeratorQuery } from '@/services/api/moderation/query'
import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'

export default function useAuthorizedForModeration(chatId: string) {
  const myAddress = useMyAccount((state) => state.address)
  const { data: chat } = getPostQuery.useQuery(chatId)

  const isOwner = chat?.struct.ownerId === myAddress
  const { data: moderator } = getModeratorQuery.useQuery(myAddress ?? '', {
    enabled: !!myAddress,
  })

  if (!COMMUNITY_CHAT_HUB_ID || !isOwner)
    return { isAuthorized: false, isOwner }
  return {
    isAuthorized: !!(moderator?.address && moderator.postIds?.includes(chatId)),
    isOwner,
  }
}
