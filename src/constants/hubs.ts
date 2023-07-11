const ALIAS_TO_HUB_ID_MAP: Record<string, string> = {
  x: '1002',
  polka: '1005',
  // nft: '1009',
  polkassembly: '1010',
  events: '1011',
  'polkadot-study': '1014',
  zeitgeist: '1015',
  kodadot: '1020',
  decoded: '1023',
  d: '1023',
}

const HUB_ID_TO_ALIAS_MAP = Object.entries(ALIAS_TO_HUB_ID_MAP).reduce(
  (acc, [alias, hubId]) => {
    acc[hubId] = alias
    return acc
  },
  {} as Record<string, string>
)
export function getAliasFromHubId(hubId: string) {
  return HUB_ID_TO_ALIAS_MAP[hubId] ?? ''
}
export function getHubIdFromAlias(alias: string) {
  return ALIAS_TO_HUB_ID_MAP[alias] ?? ''
}

const LINKED_CHAT_IDS_FOR_HUB_ID: Record<string, string[]> = {
  '1005': ['754', '2808', '2052'],
  '1002': ['3477', '3454', '4923'],
  '1010': ['754', '2065', '2027', '5145', '2035', '2064'],
  '1023': ['3454'],
}
export function getLinkedChatIdsForHubId(hubId: string) {
  return LINKED_CHAT_IDS_FOR_HUB_ID[hubId] ?? []
}

const PINNED_CHATS_IN_HUB_ID: Record<string, string[]> = {
  '1023': ['6039', '3454'],
  '1002': ['6914'],
}
export function getPinnedChatsInHubId(hubId: string) {
  return PINNED_CHATS_IN_HUB_ID[hubId] ?? []
}
