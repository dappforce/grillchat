import { getCrustIpfsAuth, getIpfsPinUrl } from '@/utils/env/server'
import { SubsocialIpfsApi } from '@subsocial/api'

export function getIpfsApi() {
  const CRUST_IPFS_CONFIG = {
    ipfsNodeUrl: 'http://new-ipfs-cluster:5001',
    ipfsClusterUrl: getIpfsPinUrl(),
  }
  const headers = { authorization: `Bearer ${getCrustIpfsAuth()}` }

  const ipfs = new SubsocialIpfsApi({
    ...CRUST_IPFS_CONFIG,
    headers,
    offchainUrl: 'https://api.subsocial.network',
  })
  ipfs.setWriteHeaders(headers)
  ipfs.setPinHeaders(headers)

  return {
    ipfs,
    saveAndPinJson: async (content: Record<any, any>) => {
      const cid = await ipfs.saveContentToOffchain(content as any)
      // const cid = await ipfs.saveJson(content)
      // await ipfs.pinContent(cid, { 'meta.gatewayId': 1 })
      return cid?.toString() ?? ''
    },
    saveAndPinImage: async (file: any) => {
      const cid = await ipfs.saveFile(file)
      await ipfs.pinContent(cid, { asLink: true, 'meta.gatewayId': 1 })
      return cid?.toString() ?? ''
    },
  }
}
