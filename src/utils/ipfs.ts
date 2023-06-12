export function getIpfsContentUrl(cid: string) {
  if (!cid || cid.startsWith('http')) return cid
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
    ? ({
        id: replyToMessageId,
        kind: 'Post',
      } as const)
    : undefined
}
