import Toast from '@/components/Toast'
import { getCurrentUrlOrigin, getUrlQuery } from '@/utils/links'
import { isServer } from '@tanstack/react-query'
import Router from 'next/router'
import toast from 'react-hot-toast'
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
    toast.custom((t) => (
      <Toast
        t={t}
        title='Login Success!'
        icon={(className) => <span className={className}>🥳</span>}
      />
    ))
    window.location.href = urlJoin(getCurrentUrlOrigin(), fromPath)
    return
  }
  closeModal()
}
