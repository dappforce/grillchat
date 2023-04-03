export function getIpfsContentUrl(cid: string) {
  return `https://ipfs.subsocial.network/ipfs/${cid}`
}

export function IpfsWrapper(cid?: string) {
  return cid ? { None: null } : { IPFS: cid }
}
