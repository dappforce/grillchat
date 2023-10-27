import { SUBSOCIAL_IPFS_GATEWAY } from '@/constants/links'
import { CID } from 'ipfs-http-client'
import { importer } from 'ipfs-unixfs-importer'
import urlJoin from 'url-join'

enum CID_KIND {
  CBOR = 113,
  UNIXFS = 112,
}

export function getIpfsContentUrl(
  uri: string,
  gatewayUrl = SUBSOCIAL_IPFS_GATEWAY
) {
  if (!uri) return uri

  const gatewayUrlWithIpfs = urlJoin(gatewayUrl, '/ipfs/')
  if (uri.startsWith('ipfs://'))
    return uri.replace('ipfs://', gatewayUrlWithIpfs)
  if (uri.startsWith('https://ipfs.io/ipfs/'))
    return uri.replace('https://ipfs.io/ipfs/', gatewayUrlWithIpfs)

  if (uri.startsWith('http')) return uri

  try {
    const ipfsCid = CID.parse(uri)
    if (!ipfsCid) return uri

    const isCbor = ipfsCid.code === CID_KIND.CBOR
    if (isCbor) {
      return urlJoin(SUBSOCIAL_IPFS_GATEWAY, `/api/v0/dag/get?arg=${uri}`)
    }
    return urlJoin(SUBSOCIAL_IPFS_GATEWAY, `/ipfs/${uri}`)
  } catch {}

  return uri
}

export function getCidFromMetadataLink(link: string) {
  return link.replace(/^(ipfs:\/\/ipfs\/|ipfs:\/\/)/, '')
}

export function getSubIdUrl(account: string) {
  return `https://sub.id/${account}`
}

export function IpfsWrapper(cid?: string) {
  return cid ? { IPFS: cid } : { None: null }
}

export function ReplyWrapper(replyToMessageId: string | undefined | null) {
  return replyToMessageId
    ? ({
        id: replyToMessageId,
        kind: 'Post',
      } as const)
    : undefined
}

const block = {
  get: async (cid: string) => {
    throw new Error(`unexpected block API get for ${cid}`)
  },
  put: async () => {
    throw new Error('unexpected block API put')
  },
}
export async function getCID(content: any) {
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }

  content = new TextEncoder().encode(content)

  let lastCid
  for await (const { cid } of importer([{ content }], block as any, {
    onlyHash: true,
  })) {
    lastCid = cid
  }
  if (!lastCid) return ''
  const parsedCid = CID.parse(lastCid.toString())

  return parsedCid.toV1().toString()
}
