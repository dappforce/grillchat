import { constantsConfig } from '@/constants/config'
import { useMyMainAddress } from '@/stores/my-account'

export default function useIsWhitelisted(chatId: string) {
  const myAddress = useMyMainAddress()

  const whitelistedAddresses =
    constantsConfig.whitelistedAddressesInChatId[chatId]

  const isWhitelisted = whitelistedAddresses?.includes(myAddress ?? '')

  if (whitelistedAddresses && (!myAddress || !isWhitelisted)) {
    return false
  }
  return true
}
