import { getHubIdFromAlias } from '@/constants/hubs'
import useToastError from '@/hooks/useToastError'
import { useCreateDiscussion } from '@/services/api/mutation'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatPage, { ChatPageProps } from './ChatPage'

export default function StubChatPage() {
  const { mutateAsync: createDiscussion, error } = useCreateDiscussion()
  useToastError(error, 'Failed to create discussion')

  const [metadata, setMetadata] = useState<ChatPageProps['stubMetadata']>({
    body: '',
    image: '',
    title: '',
  })

  const router = useRouter()

  useEffect(() => {
    async function handleDiscussion() {
      const hubIdOrAlias = router.query.hubId as string
      if (!router.isReady || !hubIdOrAlias) return

      const hubId = getHubIdFromAlias(hubIdOrAlias) || hubIdOrAlias

      const metadata = decodeURIComponent(getUrlQuery('metadata'))
      const resourceId = router.query.resourceId as string

      const parsedMetadata = metadata ? JSON.parse(metadata) : undefined
      if (!parsedMetadata || !resourceId) {
        router.replace('/')
        return
      }

      setMetadata(parsedMetadata)

      const { data } = await createDiscussion({
        spaceId: hubId,
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

  return <ChatPage hubId='' stubMetadata={metadata} />
}
