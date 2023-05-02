import { PostData } from '@subsocial/api/types'

export function isMessageIdBlocked(messageId: string, blockedIds: string[]) {
  return blockedIds.includes(messageId)
}

export function isMessageBlocked(
  message: PostData,
  blockedData: {
    addresses: string[]
    contentIds: string[]
    postIds: string[]
  }
) {
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

export function getLastMessageId(
  commentIds: string[] | undefined,
  blockedIds: string[] | undefined
) {
  if (!commentIds) return undefined
  let idx = commentIds.length - 1
  while (true) {
    if (idx < 0) {
      return undefined
    }

    const id = commentIds[idx]
    if (!blockedIds?.includes(id)) {
      return id
    }

    idx--
  }
}
