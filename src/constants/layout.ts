import { currentNetwork } from '@/utils/network'

export const PAGES_WITH_LARGER_CONTAINER: string[] =
  currentNetwork === 'subsocial' ? [] : []
