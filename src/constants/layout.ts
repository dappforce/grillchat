import { currentNetwork } from '@/utils/network'

export const PAGES_WITH_LARGER_CONTAINER =
  currentNetwork === 'subsocial'
    ? ['/staking', '/', '/[hubId]', '/opengov', '/opengov/[id]']
    : []
