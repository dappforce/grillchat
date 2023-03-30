import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useMyAccount } from '@/stores/my-account'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export const ACCOUNT_SECRET_KEY_URL_PARAMS = 'sk'

export default function AccountPage() {
  const login = useMyAccount((state) => state.login)
  const router = useRouter()
  const routeReplace = useRef(router.replace)
  useEffect(() => {
    const { search } = window.location
    const searchParams = new URLSearchParams(search)
    const key = searchParams.get(ACCOUNT_SECRET_KEY_URL_PARAMS)
    if (!key) {
      routeReplace.current('/')
      return
    }
    login(key)
    routeReplace.current('/')
  }, [login])

  return <DefaultLayout />
}
