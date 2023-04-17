export function getIpfsContentUrl(cid: string) {
  return `https://ipfs.subsocial.network/ipfs/${cid}`
}

export function IpfsWrapper(cid?: string) {
  return cid ? { IPFS: cid } : { None: null }
}

export function ReplyWrapper(replyToPostId: string | undefined | null) {
  return replyToPostId
    ? {
        id: replyToPostId,
        kind: 'Post' as const,
      }
    : undefined
}
