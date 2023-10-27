import { SUBSOCIAL_IPFS_GATEWAY } from '@/constants/links'
import { CID } from 'ipfs-http-client'
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
