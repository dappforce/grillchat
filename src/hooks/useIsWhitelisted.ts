import { getWhitelistedAddressesInChatId } from '@/constants/chat'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyMainAddress } from '@/stores/my-account'

export default function useIsWhitelisted(chatId: string) {
  const myAddress = useMyMainAddress()

  const { data: accountData } = getAccountDataQuery.useQuery(myAddress ?? '')
  const myEvmAddress = accountData?.evmAddress

  const whitelistedAddresses = getWhitelistedAddressesInChatId(chatId)

  const isWhitelisted =
    whitelistedAddresses?.includes(myAddress ?? '') ||
    whitelistedAddresses?.includes(myEvmAddress?.toLowerCase() ?? '')

  if (whitelistedAddresses && (!myAddress || !isWhitelisted)) {
    return false
  }
  return true
}
