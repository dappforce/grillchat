import { getSpaceIdFromAlias } from '@/constants/chat-room'
import { useCreateDiscussion } from '@/services/api/mutations'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatPage, { ChatPageProps } from './ChatPage'

export default function StubChatPage() {
  const { mutateAsync: createDiscussion } = useCreateDiscussion()
  const [metadata, setMetadata] = useState<ChatPageProps['stubMetadata']>({
    body: '',
    image: '',
    title: '',
  })

  const router = useRouter()

  useEffect(() => {
    async function handleDiscussion() {
      const spaceIdOrAlias = router.query.spaceId as string
      if (!router.isReady || !spaceIdOrAlias) return

      const spaceId = getSpaceIdFromAlias(spaceIdOrAlias) || spaceIdOrAlias

      const metadata = decodeURIComponent(getUrlQuery('metadata'))
      const resourceId = decodeURIComponent(getUrlQuery('resourceId'))

      const parsedMetadata = metadata ? JSON.parse(metadata) : undefined
      if (!parsedMetadata || !resourceId) {
        router.replace('/')
        return
      }

      setMetadata(parsedMetadata)

      console.log(parsedMetadata)
      const { data } = await createDiscussion({
        spaceId,
        content: parsedMetadata,
        resourceId,
      })
      if (!data?.postId) {
        router.replace('/')
        return
      }

      router.replace(getChatPageLink(router, data?.postId))
    }

    handleDiscussion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <ChatPage stubMetadata={metadata} />
}
