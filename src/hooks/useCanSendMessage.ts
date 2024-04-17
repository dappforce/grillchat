import { useMyMainAddress } from '@/stores/my-account'
import useIsAddressBlockedInChat from './useIsAddressBlockedInChat'
import useIsWhitelisted from './useIsWhitelisted'

export function useCanSendMessage(hubId: string, chatId: string) {
  const myAddress = useMyMainAddress()
  const isWhitelisted = useIsWhitelisted(chatId)

  const isBlocked = useIsAddressBlockedInChat(myAddress ?? '', chatId, hubId)

  return !isBlocked && isWhitelisted
}
