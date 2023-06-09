const ALIAS_TO_HUB_ID_MAP: Record<string, string> = {
  x: '1002',
  polka: '1005',
  // nft: '1009',
  polkassembly: '1010',
  events: '1011',
  'polkadot-study': '1014',
  zeitgeist: '1015',
  kodadot: '1020',
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
  '1010': ['754'],
}
export function getLinkedChatIdsForHubId(hubId: string) {
  return LINKED_CHAT_IDS_FOR_HUB_ID[hubId] ?? []
}
