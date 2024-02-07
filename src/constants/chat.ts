export const CHAT_PER_PAGE = 50

const DEFAULT_MAX_MESSAGE_LENGTH = 10_000
const CUSTOM_CHAT_MAX_LENGTH: Record<string, number> = {
  // example: '1': 1_000
}
export function getMaxMessageLength(chatId: string) {
  return CUSTOM_CHAT_MAX_LENGTH[chatId] ?? DEFAULT_MAX_MESSAGE_LENGTH
}
