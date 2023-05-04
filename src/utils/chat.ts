import { PostData } from '@subsocial/api/types'

export function isMessageBlocked(
  message: PostData | undefined | null,
  blockedData: {
    addresses: string[]
    contentIds: string[]
    postIds: string[]
  }
) {
  if (!message) return false

  const { addresses, contentIds, postIds } = blockedData
  const { id, struct } = message
  const contentId = struct.contentId
  const owner = struct.ownerId

  return (
    addresses.includes(owner) ||
    contentIds.includes(contentId ?? '') ||
    postIds.includes(id)
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
