import { env } from '@/env.mjs'
import { ConstantsConfig } from '.'

const xsocialConfig: ConstantsConfig = {
  aliases: {
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
    offchain: '1386',
    subsocial: '1772',
  },
  linkedChatsForHubId: {
    '1005': ['754', '2808', '2052'],
    '1002': ['3477', '3454', '4923', '7465', '19361'],
    '1010': ['754', '2065', '2027', '5145', '2035', '2064'],
    '1023': ['3454'],
  },
  pinnedChatsInHubId: {
    '1023': ['6039', '3454'],
    '1002': ['6914'],
  },
  communityHubIds: [
    env.NEXT_PUBLIC_COMMUNITY_HUB_ID,
    process.env.NODE_ENV === 'development' ? '1025' : '',
  ].filter(Boolean),
  pinnedHubIds: ['1772'],
  hubsWithoutJoinButton: [
    '1023',
    '1025',
    '1002',
    '1005',
    '1010',
    '1011',
    '1007',
    '1031',
  ],
  chatsWithJoinButton: ['6914'],

  pinnedMessageInChatId: {
    '6039': '6165',
    '3454': '6159',
  },
  annChatId: '6914',
  whitelistedAddressesInChatId: {
    '6914': [
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
  includedChatIdsForPWAUnreadCount: ['754', '7465'],
  chatIdsWithoutAnonLoginOptions: ['19361'],
  chatsForStakers: ['20132', '6946'],
}

export default xsocialConfig
