export const SUGGEST_FEATURE_LINK =
  'https://grill.chat/x/grill-improvements-1316'

export function getSuggestNewChatRoomLink(prefill: {
  chatName?: string
  hubId?: string
}) {
  return `https://docs.google.com/forms/d/e/1FAIpQLSdhp3ZGAH3Gxbm6xtRcd8QgjI3M2RVdUY9UqepseXKr3DXirw/viewform?entry.96999585=${
    prefill.hubId ?? ''
  }&entry.1674564644=${prefill.chatName}`
}

const TELEGRAM_NOTIFICATIONS_BOT_LINK = 'https://t.me/grill_notifications_bot/'

export function getTelegramNotificationsBotLink(command: string) {
  return `${TELEGRAM_NOTIFICATIONS_BOT_LINK}?start=${command}`
}
