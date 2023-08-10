import { getIsHubWithoutJoinButton } from '@/constants/hubs'
import { useMyAccount } from '@/stores/my-account'
import useIsAddressBlockedInChat from './useIsAddressBlockedInChat'
import useIsJoinedToChat from './useIsJoinedToChat'
import useIsWhitelisted from './useIsWhitelisted'

export function useCanSendMessage(hubId: string, chatId: string) {
  const myAddress = useMyAccount((state) => state.address)
  const isWhitelisted = useIsWhitelisted(chatId)

  const { isJoined } = useIsJoinedToChat(chatId)
  const isHubWithoutJoinButton = getIsHubWithoutJoinButton(hubId, chatId)
  const isShowingJoinButton = !isJoined && !isHubWithoutJoinButton

  const isBlocked = useIsAddressBlockedInChat(myAddress ?? '', chatId, hubId)

  return !isShowingJoinButton && !isBlocked && isWhitelisted
}
