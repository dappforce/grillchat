import { currentNetwork } from '@/utils/network'

export const PAGES_WITH_LARGER_CONTAINER =
  currentNetwork === 'subsocial'
    ? [
        '/',
        '/[hubId]',
        '/staking',
        '/opengov',
        '/opengov/[id]',
        '/leaderboard',
        '/leaderboard/[address]',
      ]
    : []
