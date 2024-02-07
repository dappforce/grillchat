import { getNetwork } from '@/utils/network'
import subsocialConfig from './subsocial'
import xsocialConfig from './xsocial'

export type ConstantsConfig = {
  aliases: Record<string, string | undefined>
  linkedChatsForHubId: Record<string, string[] | undefined>
  pinnedChatsInHubId: Record<string, string[] | undefined>
  communityHubIds: string[]
  pinnedHubIds: string[]
  hubsWithoutJoinButton: string[]
  chatsWithJoinButton: string[]

  pinnedMessageInChatId: Record<string, string | undefined>
  annChatId: string
  whitelistedAddressesInChatId: Record<string, string[] | undefined>
  includedChatIdsForPWAUnreadCount: string[]
  chatIdsWithoutAnonLoginOptions: string[]
  chatsForStakers: string[]
}

export const constantsConfig =
  getNetwork() === 'subsocial' ? subsocialConfig : xsocialConfig

const hubIdToAliasMap = Object.entries(constantsConfig.aliases).reduce(
  (acc, [alias, hubId]) => {
    if (!hubId) return acc
    return { ...acc, [hubId]: alias }
  },
  {} as Record<string, string>
)
export function getAliasFromHubId(hubId: string) {
  return hubIdToAliasMap[hubId] ?? ''
}
export function getHubIdFromAlias(alias: string) {
  return constantsConfig.aliases[alias] ?? ''
}

export const isCommunityHubId = (hubId: string | undefined) =>
  constantsConfig.communityHubIds.includes(hubId ?? '')

export function getPinnedHubIds() {
  return [...constantsConfig.communityHubIds, ...constantsConfig.pinnedHubIds]
}

export function getIsHubWithoutJoinButton(hubId: string, chatId: string) {
  return (
    constantsConfig.hubsWithoutJoinButton.includes(hubId) &&
    !constantsConfig.chatsWithJoinButton.includes(chatId)
  )
}
