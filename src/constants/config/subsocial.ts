import { env } from '@/env.mjs'
import { ConstantsConfig } from '.'

const subsocialConfig: ConstantsConfig = {
  aliases: {
    featured: '12659',
    subsocial: '12660',
    cc: '12455',
    offchain: '12662',
  },
  linkedChatsForHubId: {
    '12659': ['54469', '54464', '177594'],
    '12466': ['54461', '54464', '54469', '55227', '54460'],
  },
  pinnedChatsInHubId: {
    '12659': ['6914'],
  },
  communityHubIds: [env.NEXT_PUBLIC_COMMUNITY_HUB_ID].filter(Boolean),
  pinnedHubIds: [],
  hubsWithoutJoinButton: ['12659', '12660'],
  chatsWithJoinButton: [],

  pinnedMessageInChatId: {},
  annChatId: '54460',
  whitelistedAddressesInChatId: {
    '54460': [
      '3tFT2KDqmyfBU7hoGTNSJ8j2aBXQvvSQS5ncBdgtMM6SBQBS',
      '3rJPTPXHEq6sXeXK4CCgSnWhmakfpG4DknH62P616Zyr9XLz',
      '3q5o5HibyHXYrwVMinjcL4j95SDVNmLE46pu9Z5C8RTiWzwh',
      '3tATRYq6yiws8B8WhLxEuNPFtpLFh8xxe2K2Lnt8NTrjXk8N',
      // Vanessa
      '3rraq9sYfdrxjGrVDJgG7uzRgVP2BhKZxG1mCwP2pjUpKCCF',

      // EVM addresses need to be lower cased, because the casing might be different in different circumstances
      '0x8f7131da7c374566ad3084049d4e1806ed183a27',
      '0x26674d44c3a4c145482dd360069a8e5fee2ec74c',
    ],
  },
  includedChatIdsForPWAUnreadCount: ['12659', '12660'],
  chatIdsWithoutAnonLoginOptions: [],
  chatsForStakers: [],
}

export default subsocialConfig
