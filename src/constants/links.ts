export const SUGGEST_FEATURE_LINK = 'https://grill.hellonext.co'

const SUGGEST_NEW_CHAT_ROOM_LINK =
  'https://docs.google.com/forms/d/e/1FAIpQLSdhp3ZGAH3Gxbm6xtRcd8QgjI3M2RVdUY9UqepseXKr3DXirw/viewform?entry.1674564644='
export function getSuggestNewChatRoomLink(chatName?: string) {
  return SUGGEST_NEW_CHAT_ROOM_LINK + chatName
}
