import DefaultLayout from '@/components/layouts/DefaultLayout'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { getPostQuery } from '@/services/api/query'
import { getChatPageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import urlJoin from 'url-join'

export type MessageRedirectPageProps = {
  messageId: string
  hubId: string
  chatId: string
}
export default function MessageRedirectPage({
  messageId,
  chatId,
  hubId,
}: MessageRedirectPageProps) {
  const router = useRouter()
  const { data: message } = getPostQuery.useQuery(messageId)
  const isBlocked = useIsMessageBlocked(hubId, message, chatId)

  useEffect(() => {
    if (!router.isReady) return
    if (!isBlocked) {
      router.replace(
        urlJoin(getChatPageLink(router), `?messageId=${messageId}`)
      )
    } else {
      router.replace(urlJoin(getChatPageLink(router)))
    }
  }, [router, messageId, isBlocked])

  return <DefaultLayout />
}
