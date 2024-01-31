import { getSubstrateUrl } from './env/client'

export type Network = 'xsocial' | 'subsocial'

export function getNetwork(): Network {
  if (getSubstrateUrl().wss.includes('xsocial')) return 'xsocial'
  return 'subsocial'
}
