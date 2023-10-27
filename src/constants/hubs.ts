import { getCommunityHubId } from '@/utils/env/client'

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
  cc: '1030',
  ai: '1031',
  creators: '1218',
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
  '1002': ['3477', '3454', '4923', '7465'],
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

export const COMMUNITY_CHAT_HUB_ID: string | null = getCommunityHubId() || null
export const PINNED_HUB_IDS = [COMMUNITY_CHAT_HUB_ID, '1031'].filter(
  Boolean
) as string[]

const HUB_ID_WITHOUT_JOIN_BUTTON = [
  '1023',
  '1025',
  '1002',
  '1005',
  '1010',
  '1011',
  '1007',
  '1031',
]
const CHAT_WITH_JOIN_BUTTON = ['6914']
export function getIsHubWithoutJoinButton(hubId: string, chatId: string) {
  return (
    HUB_ID_WITHOUT_JOIN_BUTTON.includes(hubId) &&
    !CHAT_WITH_JOIN_BUTTON.includes(chatId)
  )
}
