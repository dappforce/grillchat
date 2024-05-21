import DefaultLayout from '@/components/layouts/DefaultLayout'
import { env } from '@/env.mjs'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { getPostQuery } from '@/services/api/query'
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
  const { data: message } = getPostQuery.useQuery(messageId)
  const isBlocked = useIsMessageBlocked(
    env.NEXT_PUBLIC_MAIN_SPACE_ID,
    message,
    env.NEXT_PUBLIC_MAIN_CHAT_ID
  )

  useEffect(() => {
    if (!router.isReady) return
    console.log(isBlocked)
    if (!isBlocked) {
      console.log(urlJoin('/memes', `?messageId=${messageId}`))
      router.replace(urlJoin('/memes', `?messageId=${messageId}`))
    } else {
      router.replace(urlJoin('/memes'))
    }
  }, [router, messageId, isBlocked])

  return <DefaultLayout />
}
