import { getCurrentUrlOrigin, getUrlQuery } from '@/utils/links'
import { isServer } from '@tanstack/react-query'
import Router from 'next/router'
import urlJoin from 'url-join'

function getIsLoginRoute() {
  if (isServer) return false
  return Router.pathname === '/login'
}

export function getRedirectCallback() {
  let fromQuery = getUrlQuery('from')
  if (getIsLoginRoute() && !fromQuery) {
    fromQuery = '/'
  }
  return fromQuery
}

export function finishLogin(closeModal: () => void) {
  let fromPath = getRedirectCallback()

  if (getIsLoginRoute()) fromPath = '/'
  if (fromPath) {
    window.location.href = urlJoin(getCurrentUrlOrigin(), fromPath)
    return
  }
  closeModal()
}
