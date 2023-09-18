import Button from '@/components/Button'
import { getHubIdFromAlias } from '@/constants/hubs'
import useToastError from '@/hooks/useToastError'
import { ApiDiscussionResponse } from '@/pages/api/discussion'
import { useCreateDiscussion } from '@/services/api/mutation'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatPage, { ChatPageProps } from './ChatPage'

export default function StubChatPage() {
  const { mutateAsync, error, isLoading } = useCreateDiscussion()
  useToastError<ApiDiscussionResponse>(
    error,
    'Failed to create discussion',
    (response) => response.message
  )

  const [metadata, setMetadata] = useState<ChatPageProps['stubMetadata']>({
    body: '',
    image: '',
    title: '',
  })

  const router = useRouter()
  useEffect(() => {
    setMetadata(getMetadataFromUrl())
  }, [])

  const createDiscussion = async function handleDiscussion() {
    const hubIdOrAlias = router.query.hubId as string
    if (!router.isReady || !hubIdOrAlias) return

    const hubId = getHubIdFromAlias(hubIdOrAlias) || hubIdOrAlias

    const resourceId = router.query.resourceId as string
    const metadata = getMetadataFromUrl()

    if (!metadata || !resourceId) {
      router.replace('/')
      return
    }

    const { data } = await mutateAsync({
      spaceId: hubId,
      content: metadata,
      resourceId,
    })
    if (!data?.postId) {
      router.replace('/')
      return
    }

    router.replace(getChatPageLink(router, data?.postId))
  }

  return (
    <ChatPage
      hubId=''
      stubMetadata={metadata}
      customAction={
        <Button size='lg' onClick={createDiscussion} isLoading={isLoading}>
          Start Discussion
        </Button>
      }
    />
  )
}

function getMetadataFromUrl() {
  const metadata = decodeURIComponent(getUrlQuery('metadata'))
  const parsedMetadata = metadata ? JSON.parse(metadata) : undefined
  return parsedMetadata
}
