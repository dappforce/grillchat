import { useMyMainAddress } from '@/stores/my-account'
import useIsAddressBlockedInChat from './useIsAddressBlockedInChat'

export function useCanSendMessage(hubId: string, chatId: string) {
  const myAddress = useMyMainAddress()

  const isBlocked = useIsAddressBlockedInChat(myAddress ?? '', chatId, hubId)

  return !isBlocked
}
