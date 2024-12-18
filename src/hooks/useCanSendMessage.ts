import { getIsHubWithoutJoinButton } from '@/constants/config'
import { useMyMainAddress } from '@/stores/my-account'
import useIsAddressBlockedInChat from './useIsAddressBlockedInChat'
import useIsJoinedToChat from './useIsJoinedToChat'

export function useCanSendMessage(hubId: string, chatId: string) {
  const myAddress = useMyMainAddress()

  const { isJoined } = useIsJoinedToChat(chatId)
  const isHubWithoutJoinButton = getIsHubWithoutJoinButton(hubId, chatId)
  const isShowingJoinButton = !isJoined && !isHubWithoutJoinButton

  const isBlocked = useIsAddressBlockedInChat(myAddress ?? '', chatId, hubId)

  return !isShowingJoinButton && !isBlocked
}
