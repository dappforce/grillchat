export function getIpfsContentUrl(cid: string) {
  return `https://ipfs.subsocial.network/ipfs/${cid}`
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
