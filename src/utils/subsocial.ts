import { SUBSTRATE_URL } from '@/constants/subsocial'
import { setSubsocialConfig } from '@/subsocial-query/subsocial/config'

export const getSubsocialApi = setSubsocialConfig('staging', {
  substrateUrl: SUBSTRATE_URL,
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
  ipfsAdminNodeUrl: 'https://gw.crustfiles.app',
})
