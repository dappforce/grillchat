import { mapBlockedResources, moderationRequest } from './utils'

const generateBlockedInSpaceIds = (spaceIds: string[]) => {
  return `
    query GetBlockedInSpaceIds {
      ${spaceIds.map(
        (hubId) =>
          `SEPARATOR${hubId}: blockedResourceIds(
            ctxSpaceId: "${hubId}"
            blocked: true
          )`
      )}
    }
  `
}
export async function getBlockedInSpaceIds(spaceIds: string[]) {
  const data = await moderationRequest<Record<string, string[]>>({
    document: generateBlockedInSpaceIds(spaceIds),
  })

  return Object.entries(data).map(([key, res]) => {
    const [_, spaceId] = key.split('SEPARATOR')
    return {
      spaceId,
      blockedResources: mapBlockedResources(res),
    }
  })
}

const generateBlockedInPostIds = (postIds: string[]) => {
  return `
    query GetBlockedInPostIds {
      ${postIds.map(
        (postId) =>
          `SEPARATOR${postId}: blockedResourceIds(
            ctxPostId: "${postId}"
            blocked: true
          )`
      )}
    }
  `
}

export async function getBlockedInPostIds(postIds: string[]) {
  const data = await moderationRequest<Record<string, string[]>>({
    document: generateBlockedInPostIds(postIds),
  })

  return Object.entries(data).map(([key, res]) => {
    const [_, postId] = key.split('SEPARATOR')
    return {
      postId,
      blockedResources: mapBlockedResources(res),
    }
  })
}
