import { ParsedUrlQuery } from 'querystring'

export function getUrlQuery(queryName: string) {
  const query = window.location.search
  const searchParams = new URLSearchParams(query)
  return searchParams.get(queryName) ?? ''
}

export function getCurrentUrlOrigin() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export function getCurrentUrlWithoutQuery() {
  return window.location.origin + window.location.pathname
}

type CurrentPath = { query: ParsedUrlQuery }
function getHubIdFromUrl(currentPath: CurrentPath) {
  return currentPath.query.hubId as string
}

export function getHubPageLink(currentPath: CurrentPath) {
  const hubId = getHubIdFromUrl(currentPath)
  return `/${hubId ?? ''}`
}

export function getChatPageLink(
  currentPath: CurrentPath,
  chatSlug?: string,
  defaultHubId?: string
) {
  const hubId = getHubIdFromUrl(currentPath) ?? defaultHubId
  const currentSlug = currentPath.query.slug
  if (!chatSlug && typeof currentSlug === 'string') {
    chatSlug = currentSlug
  }
  return `/${hubId}/${chatSlug}`
}

export function validateVideoUrl(url: string) {
  const videoFileUrlRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/i
  return videoFileUrlRegex.test(url)
}
