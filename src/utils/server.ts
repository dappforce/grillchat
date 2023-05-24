import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedMessageIdsInChatIdQuery,
} from '@/services/moderation/query'
import { SubsocialIpfsApi } from '@subsocial/api'
import { QueryClient } from '@tanstack/react-query'
import { getCrustIpfsAuth, getIpfsPinUrl } from './env/server'

export function prefetchBlockedEntities(
  queryClient: QueryClient,
  chatIds: string[]
) {
  return Promise.all([
    getBlockedCidsQuery.fetchQuery(queryClient, null),
    getBlockedAddressesQuery.fetchQuery(queryClient, null),
    ...chatIds.map((id) =>
      getBlockedMessageIdsInChatIdQuery.fetchQuery(queryClient, id)
    ),
  ])
}

export function getIpfsApi() {
  const CRUST_IPFS_CONFIG = {
    ipfsNodeUrl: 'https://gw-seattle.crustcloud.io',
    ipfsClusterUrl: getIpfsPinUrl(),
  }
  const headers = { authorization: `Bearer ${getCrustIpfsAuth()}` }

  const ipfs = new SubsocialIpfsApi({
    ...CRUST_IPFS_CONFIG,
    headers,
  })
  ipfs.setWriteHeaders(headers)
  ipfs.setPinHeaders(headers)

  return {
    ipfs,
    saveAndPinJson: async (content: Record<any, any>) => {
      const cid = await ipfs.saveJson(content)
      await ipfs.pinContent(cid, { 'meta.gatewayId': 1 })
      return cid
    },
  }
}
