import { env } from '@/env.mjs'

export type Network = 'xsocial' | 'subsocial'

export function getNetwork(): Network {
  if (env.NEXT_PUBLIC_SUBSTRATE_WSS.includes('xsocial')) return 'xsocial'
  return 'subsocial'
}

export const estimatedWaitTime = getNetwork() === 'xsocial' ? 15 : 30
