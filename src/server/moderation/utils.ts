import { getModerationConfig } from '@/utils/env/server'
import { isAddress } from '@polkadot/util-crypto'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import { CID } from 'ipfs-http-client'

export function moderationRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const { url, token } = getModerationConfig()
  if (!url || !token) throw new Error('Moderation config not found')

  const TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: TIMEOUT,
    headers: {
      authorization: `Bearer ${token}`,
    },
    ...config,
  })
  return client.request({ url, ...config })
}

type ResourceTypes = 'cid' | 'address' | 'postId'
export function mapBlockedResources(resourceIds: string[]) {
  const data: Record<ResourceTypes, string[]> = {
    cid: [],
    address: [],
    postId: [],
  }
  resourceIds.forEach((resourceId) => {
    const type = getBlockedResourceType(resourceId)
    if (!type) return

    data[type].push(resourceId)
  })
  return data
}
function getBlockedResourceType(resourceId: string): ResourceTypes | null {
  if (isValidSubstrateAddress(resourceId)) return 'address'
  if (isValidCID(resourceId)) return 'cid'
  if (isPostId(resourceId)) return 'postId'

  return null
}
function isValidSubstrateAddress(maybeAddress: string) {
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
