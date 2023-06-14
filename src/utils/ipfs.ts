import { CID } from 'ipfs-http-client'

enum CID_KIND {
  CBOR = 113,
  UNIXFS = 112,
}

export function getIpfsContentUrl(cid: string) {
  if (!cid || cid.startsWith('http')) return cid

  const ipfsCid = CID.parse(cid)
  if (!ipfsCid) return cid

  const isCbor = ipfsCid.code === CID_KIND.CBOR
  if (isCbor) {
    return `https://ipfs.subsocial.network/api/v0/dag/get?arg=${cid}`
  }
  return `https://ipfs.subsocial.network/ipfs/${cid}`
}

export function getSubIdUrl(account: string) {
  return `https://sub.id/${account}`
}

export function IpfsWrapper(cid?: string) {
  return cid ? { IPFS: cid } : { None: null }
}

export function ReplyWrapper(replyToMessageId: string | undefined | null) {
  return replyToMessageId
    ? {
        id: replyToMessageId,
        kind: 'Post',
      }
    : undefined
}
