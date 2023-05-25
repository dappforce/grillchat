export const SUGGEST_FEATURE_LINK = 'https://grill.hellonext.co'

export function getSuggestNewChatRoomLink(prefill: {
  chatName?: string
  hubId?: string
}) {
  return `https://docs.google.com/forms/d/e/1FAIpQLSdhp3ZGAH3Gxbm6xtRcd8QgjI3M2RVdUY9UqepseXKr3DXirw/viewform?entry.96999585=${
    prefill.hubId ?? ''
  }&entry.1674564644=${prefill.chatName}`
}
