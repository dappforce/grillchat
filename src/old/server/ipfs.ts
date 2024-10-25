import { env } from '@/env.mjs'
import { SubsocialIpfsApi } from '@subsocial/api'
import axios from 'axios'

const offchainUrl = 'https://api.subsocial.network'

export function getIpfsApi() {
  const pinUrl = env.IPFS_PIN_URL
  const writeUrl = env.IPFS_WRITE_URL

  const props = pinUrl.includes('crust')
    ? { asLink: false, 'meta.gatewayId': 1 }
    : { asLink: true }

  const headers = { authorization: `Bearer ${env.CRUST_IPFS_AUTH}` }

  const ipfs = new SubsocialIpfsApi({
    ipfsNodeUrl: writeUrl,
    ipfsClusterUrl: pinUrl,
    headers,
    offchainUrl,
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
      const res = await axios.post(`${offchainUrl}/v1/ipfs/addRaw`, file)

      if (res.status !== 200) {
        throw new Error('Error saving image' + res.statusText)
      }

      // const cid = await ipfs.saveFile(file)
      // await ipfs.pinContent(cid, props)
      return res.data?.toString() ?? ''
    },
  }
}
