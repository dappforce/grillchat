import { PostData } from '@subsocial/api/types'
import Router from 'next/router'
import { getIdFromSlug } from './slug'

export function isMessageBlocked(
  message: PostData | undefined | null,
  blockedData: {
    addresses: Set<string> | undefined
    contentIds: Set<string> | undefined
    postIds: Set<string> | undefined
  }
) {
  if (!message) return false

  const { addresses, contentIds, postIds } = blockedData
  const { id, struct, entityId } = message
  const contentId = struct.contentId
  const owner = struct.ownerId

  return (
    addresses?.has(owner) ||
    contentIds?.has(contentId ?? '') ||
    postIds?.has(id) ||
    postIds?.has(entityId ?? '')
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

export function getCurrentPageChatId() {
  const { query } = Router
  const slug = query?.slug as string
  return getIdFromSlug(slug)
}
