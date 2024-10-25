import { isAddress } from 'ethers'
import { CID } from 'ipfs-http-client'

export type ResourceTypes = 'cid' | 'address' | 'postId'
export function mapBlockedResources<T>(
  resources: T[],
  getId: (t: T) => string
) {
  const data: Record<ResourceTypes, T[]> = {
    cid: [],
    address: [],
    postId: [],
  }
  resources.forEach((resource) => {
    const resourceId = getId(resource)
    const type = getBlockedResourceType(resourceId)
    if (!type) return

    data[type].push(resource)
  })
  return data
}
export function getBlockedResourceType(
  resourceId: string
): ResourceTypes | null {
  if (isValidAddress(resourceId)) return 'address'
  if (isPostId(resourceId) || resourceId.startsWith('0x')) return 'postId'
  if (isValidCID(resourceId)) return 'cid'

  return null
}
function isValidAddress(maybeAddress: string) {
  try {
    return isAddress(maybeAddress)
  } catch (error) {
    return false
  }
}
function isValidCID(maybeCid: string | number) {
  if (!maybeCid) return false

  try {
    if (typeof maybeCid === 'string') return !!CID.parse(maybeCid)
    return !!CID.asCID(maybeCid)
  } catch (e) {
    return false
  }
}
function isPostId(maybePostId: string) {
  if (typeof maybePostId === 'string' && !/^\d+$/.test(maybePostId))
    return false

  return true
}
