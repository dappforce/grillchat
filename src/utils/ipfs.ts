import { InReplyTo } from '@subsocial/api/types'

export function getIpfsContentUrl(cid: string) {
  return `https://ipfs.subsocial.network/ipfs/${cid}`
}

export function IpfsWrapper(cid?: string) {
  return cid ? { IPFS: cid } : { None: null }
}

export function ReplyWrapper(
  replyToPostId: string | undefined | null
): InReplyTo | undefined {
  return replyToPostId
    ? {
        id: replyToPostId,
        kind: 'Post',
      }
    : undefined
}
