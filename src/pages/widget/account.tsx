import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey } from '@/utils/account'
import { getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export const ACCOUNT_SECRET_KEY_URL_PARAMS = 'sk'

export default function AccountPage() {
  const login = useMyAccount((state) => state.login)
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const sendEvent = useSendEvent()

  const router = useRouter()
  const routeReplace = useRef(router.replace)

  useEffect(() => {
    if (!isInitialized) return

    const encodedSecretKey = getUrlQuery(ACCOUNT_SECRET_KEY_URL_PARAMS)

    const returnUrl = getUrlQuery('returnUrl') || '/'
    if (!encodedSecretKey) {
      routeReplace.current(returnUrl)
      return
    }
    login(decodeSecretKey(encodedSecretKey)).then((data) => {
      routeReplace.current(returnUrl)
    })
    sendEvent('login', { eventSource: 'share_session_link' })
  }, [login, isInitialized, sendEvent])

  return <DefaultLayout />
}
