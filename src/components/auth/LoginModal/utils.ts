import { getCurrentUrlOrigin, getUrlQuery } from '@/utils/links'
import Router from 'next/router'
import urlJoin from 'url-join'

export function getRedirectCallback() {
  return getUrlQuery('from')
}

export function finishLogin(closeModal: () => void) {
  const fromPath = getRedirectCallback()
  if (fromPath) {
    Router.push(urlJoin(getCurrentUrlOrigin(), fromPath))
    return
  }
  closeModal()
}
