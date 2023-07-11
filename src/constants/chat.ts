export const CHAT_PER_PAGE = 50

const PINNED_MESSAGE_IN_CHAT_ID: Record<string, string> = {
  '6039': '6165',
  '3454': '6159',
}
export function getPinnedMessageInChatId(chatId: string) {
  return PINNED_MESSAGE_IN_CHAT_ID[chatId] ?? ''
}

const WHITELISTED_ADDRESSES_IN_CHAT_ID: Record<string, string[]> = {}
export function getWhitelistedAddressesInChatId(chatId: string) {
  const addresses = WHITELISTED_ADDRESSES_IN_CHAT_ID[chatId] as
    | string[]
    | undefined
  return addresses
}
