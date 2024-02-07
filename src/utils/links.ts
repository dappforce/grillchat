import { getAliasFromHubId } from '@/constants/config'
import { ParsedUrlQuery } from 'querystring'
import urlJoin from 'url-join'
import { getSubstrateUrl } from './env/client'

export function getUrlQuery(queryName: string) {
  const query = window.location.search
  const searchParams = new URLSearchParams(query)
  return searchParams.get(queryName) ?? ''
}

export function getCurrentUrlOrigin() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export function getCurrentUrlWithoutQuery(queryNameToRemove?: string) {
  if (queryNameToRemove) {
    const query = window.location.search
    const searchParams = new URLSearchParams(query)
    searchParams.delete(queryNameToRemove)

    const url = window.location.origin + window.location.pathname
    const search = searchParams.toString()

    if (!search) return url
    return url + '?' + search
  }
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
  const hubAliasOrId = getAliasFromHubId(hubId) || hubId

  const currentSlug = currentPath.query.slug
  if (!chatSlug && typeof currentSlug === 'string') {
    chatSlug = currentSlug
  }
  return `/${hubAliasOrId}/${chatSlug}`
}

export function validateVideoUrl(url: string) {
  const videoFileUrlRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/i
  return videoFileUrlRegex.test(url)
}

export function getPolkadotJsUrl(pathname?: string) {
  return urlJoin(
    `https://polkadot.js.org/apps/?rpc=${getSubstrateUrl().wss}/#/`,
    pathname ?? ''
  )
}
