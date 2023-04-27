import { ParsedUrlQuery } from 'querystring'

type CurrentPath = { query: ParsedUrlQuery }
function getSpaceIdFromUrl(currentPath: CurrentPath) {
  return currentPath.query.spaceId as string
}

export function getHomePageLink(currentPath: CurrentPath) {
  const spaceId = getSpaceIdFromUrl(currentPath)
  return `/${spaceId ?? ''}`
}

export function getChatPageLink(currentPath: CurrentPath, chatSlug: string) {
  const spaceId = getSpaceIdFromUrl(currentPath)
  return `/${spaceId}/c/${chatSlug}`
}
