import { env } from '@/env.mjs'

export type Network = 'xsocial' | 'subsocial'

export const currentNetwork: Network = env.NEXT_PUBLIC_SUBSTRATE_WSS.includes(
  'xsocial'
)
  ? 'xsocial'
  : 'subsocial'

export const estimatedWaitTime = currentNetwork === 'xsocial' ? 15 : 30
