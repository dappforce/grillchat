const ALIAS_TO_SPACE_ID_MAP: Record<string, string> = {
  x: '1002',
  polka: '1005',
}
const SPACE_ID_TO_ALIAS_MAP = Object.entries(ALIAS_TO_SPACE_ID_MAP).reduce(
  (acc, [alias, spaceId]) => {
    acc[spaceId] = alias
    return acc
  },
  {} as Record<string, string>
)
export function getAliasFromSpaceId(spaceId: string) {
  return SPACE_ID_TO_ALIAS_MAP[spaceId] ?? ''
}
export function getSpaceIdFromAlias(alias: string) {
  return ALIAS_TO_SPACE_ID_MAP[alias] ?? ''
}

const LINKED_CHAT_IDS_FOR_SPACE_ID: Record<string, string[]> = {
  '1005': ['754', '2808'],
}
export function getLinkedChatIdsForSpaceId(spaceId: string) {
  return LINKED_CHAT_IDS_FOR_SPACE_ID[spaceId] ?? []
}
