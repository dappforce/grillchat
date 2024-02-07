import {
  getCrustIpfsAuth,
  getIpfsPinUrl,
  getIpfsWriteUrl,
} from '@/utils/env/server'
import { SubsocialIpfsApi } from '@subsocial/api'

export function getIpfsApi() {
  const pinUrl = getIpfsPinUrl()
  const writeUrl = getIpfsWriteUrl()

  const props = pinUrl.includes('crust')
    ? { asLink: false, 'meta.gatewayId': 1 }
    : { asLink: true }

  const headers = { authorization: `Bearer ${getCrustIpfsAuth()}` }

  const ipfs = new SubsocialIpfsApi({
    ipfsNodeUrl: writeUrl,
    ipfsClusterUrl: pinUrl,
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
      // await ipfs.pinContent(cid, props)
      return cid?.toString() ?? ''
    },
    saveAndPinImage: async (file: any) => {
      const cid = await ipfs.saveFile(file)
      await ipfs.pinContent(cid, props)
      return cid?.toString() ?? ''
    },
  }
}
