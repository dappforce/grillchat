import { Identity } from '@/services/datahub/identity/query'
import { identityModerationEncoder } from '@/services/datahub/identity/utils'
import { PostData } from '@subsocial/api/types'

export function isMessageBlocked(
  message: PostData | undefined | null,
  ownerIdentity: Identity | undefined | null,
  blockedData: {
    addresses: Set<string> | undefined
    contentIds: Set<string> | undefined
    postIds: Set<string> | undefined
    identities: Set<string> | undefined
  }
) {
  if (!message) return false

  const { addresses, contentIds, postIds, identities } = blockedData
  const { id, struct, entityId } = message
  const contentId = struct.contentId
  const owner = struct.ownerId

  return (
    addresses?.has(owner) ||
    contentIds?.has(contentId ?? '') ||
    postIds?.has(id) ||
    postIds?.has(entityId ?? '') ||
    identities?.has(identityModerationEncoder.encode(ownerIdentity?.id) ?? '')
  )
}

export function filterBlockedMessageIds(
  messageIds: string[],
  blockedIds: string[] | undefined
) {
  if (!blockedIds) return messageIds
  const blockedIdsSet = new Set(blockedIds)
  return messageIds.filter((id) => !blockedIdsSet?.has(id))
}
