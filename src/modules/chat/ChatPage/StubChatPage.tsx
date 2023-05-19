import { getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatPage, { ChatPageProps } from './ChatPage'

export default function StubChatPage() {
  const [metadata, setMetadata] = useState<ChatPageProps['stubMetadata']>({
    body: '',
    image: '',
    title: '',
  })

  const router = useRouter()
  useEffect(() => {
    const metadata = getUrlQuery('metadata')
    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined
    if (!parsedMetadata) {
      router.replace('/')
      return
    }

    setMetadata(parsedMetadata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ChatPage stubMetadata={metadata} />
}
