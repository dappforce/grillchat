export const CHAT_PER_PAGE = 50

const PINNED_MESSAGE_IN_CHAT_ID: Record<string, string> = {
  '6039': '6165',
  '3454': '6159',
}

export const ANN_CHAT_ID = '6914'
export function getPinnedMessageInChatId(chatId: string) {
  return PINNED_MESSAGE_IN_CHAT_ID[chatId] ?? ''
}

const WHITELISTED_ADDRESSES_IN_CHAT_ID: Record<string, string[]> = {
  '6914': [
    '3tFT2KDqmyfBU7hoGTNSJ8j2aBXQvvSQS5ncBdgtMM6SBQBS',
    '3rJPTPXHEq6sXeXK4CCgSnWhmakfpG4DknH62P616Zyr9XLz',
    '3q5o5HibyHXYrwVMinjcL4j95SDVNmLE46pu9Z5C8RTiWzwh',
    '3tATRYq6yiws8B8WhLxEuNPFtpLFh8xxe2K2Lnt8NTrjXk8N',

    // EVM addresses need to be lower cased, because the casing might be different in different circumstances
    '0x8f7131da7c374566ad3084049d4e1806ed183a27',
    '0x26674d44c3a4c145482dd360069a8e5fee2ec74c',
  ],
}
export function getWhitelistedAddressesInChatId(chatId: string) {
  const addresses = WHITELISTED_ADDRESSES_IN_CHAT_ID[chatId] as
    | string[]
    | undefined
  return addresses
}

const DEFAULT_MAX_MESSAGE_LENGTH = 10_000
const CUSTOM_CHAT_MAX_LENGTH: Record<string, number> = {
  // example: '1': 1_000
}
export function getMaxMessageLength(chatId: string) {
  return CUSTOM_CHAT_MAX_LENGTH[chatId] ?? DEFAULT_MAX_MESSAGE_LENGTH
}

const INCLUDED_CHAT_IDS_FOR_UNREAD_COUNT: string[] = ['754', '7465']
export function getIncludedChatIdsForUnreadCount() {
  return INCLUDED_CHAT_IDS_FOR_UNREAD_COUNT
}

const CHAT_IDS_WITHOUT_ANON_LOGIN_OPTIONS: string[] = ['19361']
export function getChatIdsWithoutAnonLoginOptions() {
  return CHAT_IDS_WITHOUT_ANON_LOGIN_OPTIONS
}
