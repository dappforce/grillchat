import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getChatPageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import urlJoin from 'url-join'

export default function AboutChatRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    router.replace(urlJoin(getChatPageLink(router), '?open=about'))
  }, [router])

  return <DefaultLayout />
}
