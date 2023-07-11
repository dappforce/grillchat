export const CHAT_PER_PAGE = 50

const PINNED_MESSAGE_IN_CHAT_ID: Record<string, string> = {
  '6039': '6165',
  '3454': '6159',
}
export function getPinnedMessageInChatId(chatId: string) {
  return PINNED_MESSAGE_IN_CHAT_ID[chatId] ?? ''
}

const WHITELISTED_ADDRESSES_IN_CHAT_ID: Record<string, string[]> = {
  '6914': [
    '3tFT2KDqmyfBU7hoGTNSJ8j2aBXQvvSQS5ncBdgtMM6SBQBS',
    '3rJPTPXHEq6sXeXK4CCgSnWhmakfpG4DknH62P616Zyr9XLz',
    '3q5o5HibyHXYrwVMinjcL4j95SDVNmLE46pu9Z5C8RTiWzwh',
    '3tATRYq6yiws8B8WhLxEuNPFtpLFh8xxe2K2Lnt8NTrjXk8N',
    '0x8f7131da7c374566aD3084049d4E1806Ed183a27',
    '0x26674D44c3a4c145482Dd360069a8e5Fee2Ec74C',
  ],
}
export function getWhitelistedAddressesInChatId(chatId: string) {
  const addresses = WHITELISTED_ADDRESSES_IN_CHAT_ID[chatId] as
    | string[]
    | undefined
  return addresses
}
