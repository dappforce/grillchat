import { currentNetwork } from '@/utils/network'

export const PAGES_WITH_SIDEBAR =
  currentNetwork === 'subsocial' ? ['/staking', '/', '/[hubId]'] : []
