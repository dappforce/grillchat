import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getChatPageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import urlJoin from 'url-join'

export type MessageRedirectPageProps = {
  messageId: string
}
export default function MessageRedirectPage({
  messageId,
}: MessageRedirectPageProps) {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    router.replace(urlJoin(getChatPageLink(router), `?messageId=${messageId}`))
  }, [router, messageId])

  return <DefaultLayout />
}
