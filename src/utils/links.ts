import { ParsedUrlQuery } from 'querystring'

export function getUrlQuery(queryName: string) {
  const query = window.location.search
  const searchParams = new URLSearchParams(query)
  return searchParams.get(queryName) ?? ''
}

export function getCurrentUrlOrigin() {
  return window.location.origin
}

export function getCurrentUrlWithoutQuery() {
  return window.location.origin + window.location.pathname
}

type CurrentPath = { query: ParsedUrlQuery }
function getSpaceIdFromUrl(currentPath: CurrentPath) {
  return currentPath.query.spaceId as string
}

export function getHomePageLink(currentPath: CurrentPath) {
  const spaceId = getSpaceIdFromUrl(currentPath)
  return `/${spaceId ?? ''}`
}

export function getChatPageLink(currentPath: CurrentPath, chatSlug?: string) {
  const spaceId = getSpaceIdFromUrl(currentPath)
  const currentSlug = currentPath.query.slug
  if (!chatSlug && typeof currentSlug === 'string') {
    chatSlug = currentSlug
  }
  return `/${spaceId}/${chatSlug}`
}
