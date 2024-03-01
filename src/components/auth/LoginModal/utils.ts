import { getCurrentUrlOrigin, getUrlQuery } from '@/utils/links'
import urlJoin from 'url-join'

export function getRedirectCallback() {
  return getUrlQuery('from')
}

export function finishLogin(closeModal: () => void) {
  const fromPath = getRedirectCallback()
  if (fromPath) {
    window.location.href = urlJoin(getCurrentUrlOrigin(), fromPath)
    return
  }
  closeModal()
}
